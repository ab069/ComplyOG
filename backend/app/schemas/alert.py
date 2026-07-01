from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class AlertResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    alert_type: str
    severity: str
    status: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AlertUpdate(BaseModel):
    status: Optional[str] = None
