from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime, date


class AuditCreate(BaseModel):
    audit_name: str
    auditor: str
    audit_date: Optional[date] = None
    scope: Any = []
    findings: Any = []
    score: int = 0
    status: str = "planned"


class AuditUpdate(BaseModel):
    audit_name: Optional[str] = None
    auditor: Optional[str] = None
    audit_date: Optional[date] = None
    scope: Optional[Any] = None
    findings: Optional[Any] = None
    score: Optional[int] = None
    status: Optional[str] = None


class AuditResponse(BaseModel):
    id: UUID
    user_id: UUID
    audit_name: str
    auditor: str
    audit_date: Optional[date]
    scope: Any
    findings: Any
    score: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
