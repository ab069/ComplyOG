from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from ..models.emission import EmissionRecord
from ..schemas.emission import EmissionCreate, EmissionUpdate, EmissionResponse


GWP_CO2 = 1
GWP_CH4 = 28
GWP_N2O = 265


def calculate_co2e(co2: float, ch4: float, n2o: float) -> float:
    return round(co2 * GWP_CO2 + ch4 * GWP_CH4 + n2o * GWP_N2O, 4)


async def create_emission(db: AsyncSession, user_id: UUID, data: EmissionCreate) -> EmissionResponse:
    co2e = calculate_co2e(data.co2_tonnes, data.ch4_tonnes, data.n2o_tonnes)
    record = EmissionRecord(
        user_id=user_id,
        facility_name=data.facility_name,
        source_type=data.source_type,
        co2_tonnes=data.co2_tonnes,
        ch4_tonnes=data.ch4_tonnes,
        n2o_tonnes=data.n2o_tonnes,
        co2e_tonnes=co2e,
        reporting_period=data.reporting_period,
        status="draft",
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return EmissionResponse.model_validate(record)


async def get_emissions(db: AsyncSession, user_id: UUID) -> List[EmissionResponse]:
    result = await db.execute(
        select(EmissionRecord).where(EmissionRecord.user_id == user_id).order_by(EmissionRecord.created_at.desc())
    )
    return [EmissionResponse.model_validate(r) for r in result.scalars().all()]


async def get_emission(db: AsyncSession, user_id: UUID, emission_id: UUID) -> EmissionResponse:
    result = await db.execute(
        select(EmissionRecord).where(EmissionRecord.id == emission_id, EmissionRecord.user_id == user_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission not found")
    return EmissionResponse.model_validate(record)


async def update_emission(db: AsyncSession, user_id: UUID, emission_id: UUID, data: EmissionUpdate) -> EmissionResponse:
    result = await db.execute(
        select(EmissionRecord).where(EmissionRecord.id == emission_id, EmissionRecord.user_id == user_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    co2 = update_data.get("co2_tonnes", record.co2_tonnes)
    ch4 = update_data.get("ch4_tonnes", record.ch4_tonnes)
    n2o = update_data.get("n2o_tonnes", record.n2o_tonnes)
    record.co2e_tonnes = calculate_co2e(co2, ch4, n2o)
    await db.commit()
    await db.refresh(record)
    return EmissionResponse.model_validate(record)


async def delete_emission(db: AsyncSession, user_id: UUID, emission_id: UUID) -> None:
    result = await db.execute(
        select(EmissionRecord).where(EmissionRecord.id == emission_id, EmissionRecord.user_id == user_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emission not found")
    await db.delete(record)
    await db.commit()


async def get_emission_stats(db: AsyncSession, user_id: UUID) -> dict:
    result = await db.execute(
        select(EmissionRecord).where(EmissionRecord.user_id == user_id)
    )
    records = result.scalars().all()
    total_co2e = sum(r.co2e_tonnes for r in records)
    by_source = {}
    for r in records:
        by_source[r.source_type] = by_source.get(r.source_type, 0) + r.co2e_tonnes
    by_period = {}
    for r in records:
        by_period[r.reporting_period] = by_period.get(r.reporting_period, 0) + r.co2e_tonnes
    return {
        "total_co2e": round(total_co2e, 4),
        "by_source": {k: round(v, 4) for k, v in by_source.items()},
        "by_period": {k: round(v, 4) for k, v in by_period.items()},
        "total_emissions": len(records),
    }
