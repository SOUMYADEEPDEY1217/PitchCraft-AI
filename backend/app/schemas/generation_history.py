"""
Pydantic v2 schemas for AI Generation History tracking.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class AIGenerationHistoryCreate(BaseModel):
    proposal_id: Optional[str] = Field(None, alias="proposalId")
    model_name: str = Field(..., alias="modelName")
    generation_type: str = Field(..., alias="generationType")
    duration_ms: int = Field(default=0, alias="durationMs")
    status: str = Field(default="success")

    model_config = ConfigDict(populate_by_name=True)


class AIGenerationHistoryResponse(BaseModel):
    id: str
    proposal_id: Optional[str] = Field(None, alias="proposalId")
    model_name: str = Field(..., alias="modelName")
    generation_type: str = Field(..., alias="generationType")
    duration_ms: int = Field(alias="durationMs")
    status: str
    created_at: datetime = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
