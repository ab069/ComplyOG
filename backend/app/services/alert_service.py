from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.alert import Alert
from ..schemas.alert import AlertResponse, AlertUpdate


async def create_alert(db: AsyncSession, user_id: UUID, title: str, alert_type: str, severity: str, description: str = "") -> AlertResponse:
    alert = Alert(
        user_id=user_id,
        title=title,
        alert_type=alert_type,
        severity=severity,
        description=description,
        status="unread",
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return AlertResponse.model_validate(alert)


async def get_alerts(db: AsyncSession, user_id: UUID) -> List[AlertResponse]:
    result = await db.execute(
        select(Alert).where(Alert.user_id == user_id).order_by(Alert.created_at.desc()).limit(50)
    )
    return [AlertResponse.model_validate(r) for r in result.scalars().all()]


async def update_alert_status(db: AsyncSession, user_id: UUID, alert_id: UUID, data: AlertUpdate) -> AlertResponse:
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    if data.status:
        alert.status = data.status
    await db.commit()
    await db.refresh(alert)
    return AlertResponse.model_validate(alert)


async def get_alert_stats(db: AsyncSession, user_id: UUID) -> dict:
    result = await db.execute(select(Alert).where(Alert.user_id == user_id))
    alerts = result.scalars().all()
    total = len(alerts)
    unread = sum(1 for a in alerts if a.status == "unread")
    by_type = {}
    for a in alerts:
        by_type[a.alert_type] = by_type.get(a.alert_type, 0) + 1
    by_severity = {}
    for a in alerts:
        by_severity[a.severity] = by_severity.get(a.severity, 0) + 1
    return {
        "total_alerts": total,
        "unread": unread,
        "by_type": by_type,
        "by_severity": by_severity,
    }
