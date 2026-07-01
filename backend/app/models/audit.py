import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..core.database import Base


class ComplianceAudit(Base):
    __tablename__ = "compliance_audits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    audit_name = Column(String(255), nullable=False)
    auditor = Column(String(255), nullable=False)
    audit_date = Column(Date, nullable=True)
    scope = Column(String, default="[]")
    findings = Column(String, default="[]")
    score = Column(Integer, default=0)
    status = Column(String(20), default="planned")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="audits")
