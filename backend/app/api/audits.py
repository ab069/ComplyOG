from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..schemas.audit import AuditCreate, AuditUpdate, AuditResponse
from ..services import audit_service

router = APIRouter(prefix="/audits", tags=["audits"])


@router.get("/stats")
async def audit_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await audit_service.get_audit_stats(db, current_user.id)


@router.get("", response_model=List[AuditResponse])
async def list_audits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await audit_service.get_audits(db, current_user.id)


@router.get("/{audit_id}", response_model=AuditResponse)
async def get_audit(
    audit_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await audit_service.get_audit(db, current_user.id, audit_id)


@router.post("", response_model=AuditResponse, status_code=201)
async def create_audit(
    data: AuditCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await audit_service.create_audit(db, current_user.id, data)


@router.put("/{audit_id}", response_model=AuditResponse)
async def update_audit(
    audit_id: UUID,
    data: AuditUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await audit_service.update_audit(db, current_user.id, audit_id, data)


@router.delete("/{audit_id}", status_code=204)
async def delete_audit(
    audit_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await audit_service.delete_audit(db, current_user.id, audit_id)
