from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..schemas.emission import EmissionCreate, EmissionUpdate, EmissionResponse
from ..services import emission_service

router = APIRouter(prefix="/emissions", tags=["emissions"])


@router.get("/stats")
async def emission_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await emission_service.get_emission_stats(db, current_user.id)


@router.get("", response_model=List[EmissionResponse])
async def list_emissions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await emission_service.get_emissions(db, current_user.id)


@router.get("/{emission_id}", response_model=EmissionResponse)
async def get_emission(
    emission_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await emission_service.get_emission(db, current_user.id, emission_id)


@router.post("", response_model=EmissionResponse, status_code=201)
async def create_emission(
    data: EmissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await emission_service.create_emission(db, current_user.id, data)


@router.put("/{emission_id}", response_model=EmissionResponse)
async def update_emission(
    emission_id: UUID,
    data: EmissionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await emission_service.update_emission(db, current_user.id, emission_id, data)


@router.delete("/{emission_id}", status_code=204)
async def delete_emission(
    emission_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await emission_service.delete_emission(db, current_user.id, emission_id)
