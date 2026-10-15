"""
Pydantic v2 schemas for Client operations.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClientBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Full name of client contact")
    company: str = Field(..., min_length=1, max_length=255, description="Company or business name")
    email: EmailStr = Field(..., description="Client email address")
    phone: Optional[str] = Field(None, max_length=64)
    website: Optional[str] = Field(None, max_length=255)
    industry: str = Field(default="Technology", max_length=128)
    status: str = Field(default="lead", pattern="^(lead|active|past)$")
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    company: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(lead|active|past)$")
    notes: Optional[str] = None


class ClientResponse(ClientBase):
    id: str
    total_quoted: float = 0.0
    total_paid: float = 0.0
    proposals_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClientListResponse(BaseModel):
    items: List[ClientResponse]
    total: int
    skip: int
    limit: int
