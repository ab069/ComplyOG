from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date


class RegulationCreate(BaseModel):
    regulation_name: str
    authority: str
    category: str
    requirement: str
    deadline: Optional[date] = None
    status: str = "pending"


class RegulationUpdate(BaseModel):
    regulation_name: Optional[str] = None
    authority: Optional[str] = None
    category: Optional[str] = None
    requirement: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[str] = None


class RegulationResponse(BaseModel):
    id: UUID
    user_id: UUID
    regulation_name: str
    authority: str
    category: str
    requirement: str
    deadline: Optional[date]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
