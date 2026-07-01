import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..core.database import Base


class EmissionRecord(Base):
    __tablename__ = "emission_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    facility_name = Column(String(255), nullable=False)
    source_type = Column(String(50), nullable=False)
    co2_tonnes = Column(Float, default=0.0)
    ch4_tonnes = Column(Float, default=0.0)
    n2o_tonnes = Column(Float, default=0.0)
    co2e_tonnes = Column(Float, default=0.0)
    reporting_period = Column(String(50), nullable=False)
    status = Column(String(20), default="draft")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="emissions")
