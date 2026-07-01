from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.regulation import Regulation
from ..schemas.regulation import RegulationCreate, RegulationUpdate, RegulationResponse


async def create_regulation(db: AsyncSession, user_id: UUID, data: RegulationCreate) -> RegulationResponse:
    reg = Regulation(
        user_id=user_id,
        regulation_name=data.regulation_name,
        authority=data.authority,
        category=data.category,
        requirement=data.requirement,
        deadline=data.deadline,
        status=data.status,
    )
    db.add(reg)
    await db.commit()
    await db.refresh(reg)
    return RegulationResponse.model_validate(reg)


async def get_regulations(db: AsyncSession, user_id: UUID) -> List[RegulationResponse]:
    result = await db.execute(
        select(Regulation).where(Regulation.user_id == user_id).order_by(Regulation.created_at.desc())
    )
    return [RegulationResponse.model_validate(r) for r in result.scalars().all()]


async def get_regulation(db: AsyncSession, user_id: UUID, reg_id: UUID) -> RegulationResponse:
    result = await db.execute(
        select(Regulation).where(Regulation.id == reg_id, Regulation.user_id == user_id)
    )
    reg = result.scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Regulation not found")
    return RegulationResponse.model_validate(reg)


async def update_regulation(db: AsyncSession, user_id: UUID, reg_id: UUID, data: RegulationUpdate) -> RegulationResponse:
    result = await db.execute(
        select(Regulation).where(Regulation.id == reg_id, Regulation.user_id == user_id)
    )
    reg = result.scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Regulation not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(reg, key, value)
    await db.commit()
    await db.refresh(reg)
    return RegulationResponse.model_validate(reg)


async def delete_regulation(db: AsyncSession, user_id: UUID, reg_id: UUID) -> None:
    result = await db.execute(
        select(Regulation).where(Regulation.id == reg_id, Regulation.user_id == user_id)
    )
    reg = result.scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Regulation not found")
    await db.delete(reg)
    await db.commit()


async def get_regulation_stats(db: AsyncSession, user_id: UUID) -> dict:
    result = await db.execute(
        select(Regulation).where(Regulation.user_id == user_id)
    )
    regs = result.scalars().all()
    total = len(regs)
    compliant = sum(1 for r in regs if r.status == "compliant")
    non_compliant = sum(1 for r in regs if r.status == "non_compliant")
    pending = sum(1 for r in regs if r.status == "pending")
    waived = sum(1 for r in regs if r.status == "waived")
    compliance_rate = round((compliant / total * 100), 1) if total > 0 else 0.0
    return {
        "total_regulations": total,
        "compliant": compliant,
        "non_compliant": non_compliant,
        "pending": pending,
        "waived": waived,
        "compliance_rate": compliance_rate,
    }
