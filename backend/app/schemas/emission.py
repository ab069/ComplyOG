from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class EmissionCreate(BaseModel):
    facility_name: str
    source_type: str = Field(..., pattern="^(flare|vent|combustion|fugitive|process)$")
    co2_tonnes: float = 0.0
    ch4_tonnes: float = 0.0
    n2o_tonnes: float = 0.0
    reporting_period: str


class EmissionUpdate(BaseModel):
    facility_name: Optional[str] = None
    source_type: Optional[str] = None
    co2_tonnes: Optional[float] = None
    ch4_tonnes: Optional[float] = None
    n2o_tonnes: Optional[float] = None
    reporting_period: Optional[str] = None
    status: Optional[str] = None


class EmissionResponse(BaseModel):
    id: UUID
    user_id: UUID
    facility_name: str
    source_type: str
    co2_tonnes: float
    ch4_tonnes: float
    n2o_tonnes: float
    co2e_tonnes: float
    reporting_period: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
