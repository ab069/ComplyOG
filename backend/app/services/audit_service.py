import json
from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.audit import ComplianceAudit
from ..schemas.audit import AuditCreate, AuditUpdate, AuditResponse


async def create_audit(db: AsyncSession, user_id: UUID, data: AuditCreate) -> AuditResponse:
    audit = ComplianceAudit(
        user_id=user_id,
        audit_name=data.audit_name,
        auditor=data.auditor,
        audit_date=data.audit_date,
        scope=json.dumps(data.scope) if data.scope else "[]",
        findings=json.dumps(data.findings) if data.findings else "[]",
        score=data.score,
        status=data.status,
    )
    db.add(audit)
    await db.commit()
    await db.refresh(audit)
    return AuditResponse.model_validate(audit)


async def get_audits(db: AsyncSession, user_id: UUID) -> List[AuditResponse]:
    result = await db.execute(
        select(ComplianceAudit).where(ComplianceAudit.user_id == user_id).order_by(ComplianceAudit.created_at.desc())
    )
    audits = []
    for r in result.scalars().all():
        resp = AuditResponse.model_validate(r)
        resp.scope = json.loads(r.scope) if isinstance(r.scope, str) else r.scope
        resp.findings = json.loads(r.findings) if isinstance(r.findings, str) else r.findings
        audits.append(resp)
    return audits


async def get_audit(db: AsyncSession, user_id: UUID, audit_id: UUID) -> AuditResponse:
    result = await db.execute(
        select(ComplianceAudit).where(ComplianceAudit.id == audit_id, ComplianceAudit.user_id == user_id)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found")
    resp = AuditResponse.model_validate(audit)
    resp.scope = json.loads(audit.scope) if isinstance(audit.scope, str) else audit.scope
    resp.findings = json.loads(audit.findings) if isinstance(audit.findings, str) else audit.findings
    return resp


async def update_audit(db: AsyncSession, user_id: UUID, audit_id: UUID, data: AuditUpdate) -> AuditResponse:
    result = await db.execute(
        select(ComplianceAudit).where(ComplianceAudit.id == audit_id, ComplianceAudit.user_id == user_id)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found")
    update_data = data.model_dump(exclude_unset=True)
    if "scope" in update_data and update_data["scope"] is not None:
        update_data["scope"] = json.dumps(update_data["scope"])
    if "findings" in update_data and update_data["findings"] is not None:
        update_data["findings"] = json.dumps(update_data["findings"])
    for key, value in update_data.items():
        setattr(audit, key, value)
    await db.commit()
    await db.refresh(audit)
    resp = AuditResponse.model_validate(audit)
    resp.scope = json.loads(audit.scope) if isinstance(audit.scope, str) else audit.scope
    resp.findings = json.loads(audit.findings) if isinstance(audit.findings, str) else audit.findings
    return resp


async def delete_audit(db: AsyncSession, user_id: UUID, audit_id: UUID) -> None:
    result = await db.execute(
        select(ComplianceAudit).where(ComplianceAudit.id == audit_id, ComplianceAudit.user_id == user_id)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found")
    await db.delete(audit)
    await db.commit()


async def get_audit_stats(db: AsyncSession, user_id: UUID) -> dict:
    result = await db.execute(
        select(ComplianceAudit).where(ComplianceAudit.user_id == user_id)
    )
    audits = result.scalars().all()
    total = len(audits)
    scores = [a.score for a in audits if a.score > 0]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    by_status = {}
    for a in audits:
        by_status[a.status] = by_status.get(a.status, 0) + 1
    return {
        "total_audits": total,
        "average_score": avg_score,
        "by_status": by_status,
    }
