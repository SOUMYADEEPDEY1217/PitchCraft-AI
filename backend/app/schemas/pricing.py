"""
Pydantic v2 schemas for Pricing Calculator operations.
"""

from typing import List, Dict
from pydantic import BaseModel, ConfigDict, Field


class HoursByPhase(BaseModel):
    discovery: float = Field(default=0.0, ge=0.0)
    design: float = Field(default=0.0, ge=0.0)
    development: float = Field(default=0.0, ge=0.0)
    qa: float = Field(default=0.0, ge=0.0)
    deployment: float = Field(default=0.0, ge=0.0)


class ExpenseItem(BaseModel):
    id: str = Field(default="")
    name: str = Field(..., min_length=1)
    amount: float = Field(default=0.0, ge=0.0)


class PricingCalculateRequest(BaseModel):
    hourly_rate: float = Field(default=120.0, ge=1.0, alias="hourlyRate")
    hours_by_phase: HoursByPhase = Field(alias="hoursByPhase")
    expenses: List[ExpenseItem] = Field(default_factory=list)
    contingency_percent: float = Field(default=15.0, ge=0.0, le=100.0, alias="contingencyPercent")
    margin_percent: float = Field(default=20.0, ge=0.0, le=100.0, alias="marginPercent")

    model_config = ConfigDict(populate_by_name=True)


class MilestoneSplit(BaseModel):
    deposit: float
    midway: float
    final: float


class PricingCalculateResponse(BaseModel):
    total_hours: float
    base_labor_cost: float
    total_expenses: float
    subtotal: float
    contingency_amount: float
    margin_amount: float
    grand_total: float
    effective_rate_per_hour: float
    milestone_split: MilestoneSplit
