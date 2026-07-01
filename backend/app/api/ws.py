import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db, async_session_factory
from ..core.security import decode_access_token
from ..models.user import User
from ..services import alert_service

router = APIRouter()

connected_clients: dict[str, list[WebSocket]] = {}


async def notify_user(user_id: str, message: dict):
    if user_id in connected_clients:
        for ws in connected_clients[user_id]:
            try:
                await ws.send_json(message)
            except Exception:
                pass


async def broadcast_compliance_event(user_id: str, event_type: str, data: dict):
    await notify_user(user_id, {"type": event_type, "data": data})


@router.websocket("/ws")
async def compliance_websocket(websocket: WebSocket):
    await websocket.accept()
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001)
        return
    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    user_id = payload.get("sub")
    if user_id not in connected_clients:
        connected_clients[user_id] = []
    connected_clients[user_id].append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        pass
    finally:
        if user_id in connected_clients:
            connected_clients[user_id].remove(websocket)
            if not connected_clients[user_id]:
                del connected_clients[user_id]
