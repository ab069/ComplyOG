from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..schemas.regulation import RegulationCreate, RegulationUpdate, RegulationResponse
from ..services import regulation_service

router = APIRouter(prefix="/regulations", tags=["regulations"])


@router.get("/stats")
async def regulation_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await regulation_service.get_regulation_stats(db, current_user.id)


@router.get("", response_model=List[RegulationResponse])
async def list_regulations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await regulation_service.get_regulations(db, current_user.id)


@router.get("/{reg_id}", response_model=RegulationResponse)
async def get_regulation(
    reg_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await regulation_service.get_regulation(db, current_user.id, reg_id)


@router.post("", response_model=RegulationResponse, status_code=201)
async def create_regulation(
    data: RegulationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await regulation_service.create_regulation(db, current_user.id, data)


@router.put("/{reg_id}", response_model=RegulationResponse)
async def update_regulation(
    reg_id: UUID,
    data: RegulationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await regulation_service.update_regulation(db, current_user.id, reg_id, data)


@router.delete("/{reg_id}", status_code=204)
async def delete_regulation(
    reg_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await regulation_service.delete_regulation(db, current_user.id, reg_id)
