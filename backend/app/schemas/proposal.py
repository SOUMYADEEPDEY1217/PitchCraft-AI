"""
Pydantic v2 schemas for Proposal management and generation.
Aligns with database design (content_json, pricing_json) and frontend TypeScript types.
"""

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field, model_validator


class MilestoneSchema(BaseModel):
    id: str = Field(default_factory=lambda: f"m-{datetime.utcnow().timestamp()}")
    title: str = Field(..., min_length=1)
    description: str = Field(default="")
    duration: str = Field(default="Sprint 1")
    deliverables: List[str] = Field(default_factory=list)
    amount: float = Field(default=0.0, ge=0.0)


class PricingItemSchema(BaseModel):
    id: str = Field(default_factory=lambda: f"p-{datetime.utcnow().timestamp()}")
    description: str = Field(..., min_length=1)
    hoursOrUnits: float = Field(default=1.0, ge=0.0)
    rate: float = Field(default=0.0, ge=0.0)
    total: float = Field(default=0.0, ge=0.0)


class ProposalBase(BaseModel):
    client_id: str = Field(..., alias="clientId")
    project_title: str = Field(..., min_length=2, max_length=255, alias="title")
    project_brief: str = Field(default="", alias="brief")
    service_category: str = Field(default="web_development", alias="serviceCategory")
    tone: str = Field(default="consultative")
    currency: str = Field(default="USD", max_length=16)
    content_json: Dict[str, Any] = Field(default_factory=dict, alias="contentJson")
    pricing_json: Dict[str, Any] = Field(default_factory=dict, alias="pricingJson")
    status: str = Field(default="draft", pattern="^(draft|sent|in_review|accepted|rejected|declined)$")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ProposalCreate(BaseModel):
    id: Optional[str] = None
    client_id: Optional[str] = Field(None, alias="clientId")
    project_title: Optional[str] = Field(None, alias="title")
    project_brief: Optional[str] = Field(None, alias="brief")
    service_category: Optional[str] = Field(default="web_development", alias="serviceCategory")
    tone: Optional[str] = Field(default="consultative")
    currency: Optional[str] = Field(default="USD")
    status: Optional[str] = Field(default="draft", pattern="^(draft|sent|in_review|accepted|rejected|declined)$")

    content_json: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="contentJson")
    pricing_json: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="pricingJson")

    # Convenience flat fields from frontend forms
    client_name: Optional[str] = Field(None, alias="clientName")
    client_company: Optional[str] = Field(None, alias="clientCompany")
    client_email: Optional[str] = Field(None, alias="clientEmail")
    total_budget: Optional[float] = Field(None, alias="totalBudget")
    deadline: Optional[str] = None
    executive_summary: Optional[str] = Field(None, alias="executiveSummary")
    problem_understanding: Optional[str] = Field(None, alias="problemUnderstanding")
    objectives: Optional[List[str]] = None
    proposed_solution: Optional[str] = Field(None, alias="proposedSolution")
    deliverables: Optional[List[str]] = None
    scope_included: Optional[List[str]] = Field(None, alias="scopeIncluded")
    scope_excluded: Optional[List[str]] = Field(None, alias="scopeExcluded")
    assumptions_and_exclusions: Optional[List[str]] = Field(None, alias="assumptionsAndExclusions")
    timeline_summary: Optional[str] = Field(None, alias="timelineSummary")
    estimated_timeline: Optional[str] = Field(None, alias="estimatedTimeline")
    milestones: Optional[List[Any]] = None
    pricing_items: Optional[List[Any]] = Field(None, alias="pricingItems")
    pricing_notes: Optional[str] = Field(None, alias="pricingNotes")
    pricing_explanation: Optional[str] = Field(None, alias="pricingExplanation")
    payment_terms: Optional[str] = Field(None, alias="paymentTerms")
    client_responsibilities: Optional[List[str]] = Field(None, alias="clientResponsibilities")
    terms_and_conditions: Optional[str] = Field(None, alias="termsAndConditions")
    call_to_action: Optional[str] = Field(None, alias="callToAction")

    model_config = ConfigDict(populate_by_name=True)


class ProposalUpdate(BaseModel):
    project_title: Optional[str] = Field(None, alias="title")
    project_brief: Optional[str] = Field(None, alias="brief")
    service_category: Optional[str] = Field(None, alias="serviceCategory")
    tone: Optional[str] = None
    currency: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|sent|in_review|accepted|rejected|declined)$")
    content_json: Optional[Dict[str, Any]] = Field(None, alias="contentJson")
    pricing_json: Optional[Dict[str, Any]] = Field(None, alias="pricingJson")

    # Convenience flat fields
    total_budget: Optional[float] = Field(None, alias="totalBudget")
    deadline: Optional[str] = None
    executive_summary: Optional[str] = Field(None, alias="executiveSummary")
    problem_understanding: Optional[str] = Field(None, alias="problemUnderstanding")
    objectives: Optional[List[str]] = None
    proposed_solution: Optional[str] = Field(None, alias="proposedSolution")
    deliverables: Optional[List[str]] = None
    scope_included: Optional[List[str]] = Field(None, alias="scopeIncluded")
    scope_excluded: Optional[List[str]] = Field(None, alias="scopeExcluded")
    assumptions_and_exclusions: Optional[List[str]] = Field(None, alias="assumptionsAndExclusions")
    timeline_summary: Optional[str] = Field(None, alias="timelineSummary")
    estimated_timeline: Optional[str] = Field(None, alias="estimatedTimeline")
    milestones: Optional[List[Any]] = None
    pricing_items: Optional[List[Any]] = Field(None, alias="pricingItems")
    pricing_notes: Optional[str] = Field(None, alias="pricingNotes")
    pricing_explanation: Optional[str] = Field(None, alias="pricingExplanation")
    payment_terms: Optional[str] = Field(None, alias="paymentTerms")
    client_responsibilities: Optional[List[str]] = Field(None, alias="clientResponsibilities")
    terms_and_conditions: Optional[str] = Field(None, alias="termsAndConditions")
    call_to_action: Optional[str] = Field(None, alias="callToAction")

    model_config = ConfigDict(populate_by_name=True)


class ProposalStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(draft|sent|in_review|accepted|rejected|declined)$")


class ProposalGenerateRequest(BaseModel):
    client_name: str = Field(..., min_length=2, alias="clientName")
    client_company: Optional[str] = Field(None, alias="clientCompany")
    client_email: Optional[str] = Field(None, alias="clientEmail")
    client_id: Optional[str] = Field(None, alias="clientId")
    project_title: str = Field(..., min_length=2, alias="projectTitle")
    industry: str = Field(default="Technology")
    service_category: str = Field(default="web_development", alias="serviceCategory")
    currency: str = Field(default="USD")
    target_budget: float = Field(default=10000.0, ge=100.0, alias="targetBudget")
    deadline: str = Field(..., min_length=1)
    tone: str = Field(default="consultative")
    brief: str = Field(..., min_length=10)
    include_retainer: bool = Field(default=False, alias="includeRetainer")
    model: Optional[str] = Field(default=None, description="Optional override model name, e.g. qwen3:4b")

    model_config = ConfigDict(populate_by_name=True)


class ProposalResponse(BaseModel):
    id: str
    client_id: str = Field(alias="clientId")
    project_title: str = Field(alias="title")
    project_brief: str = Field(alias="brief")
    service_category: str = Field(alias="serviceCategory")
    tone: str
    currency: str
    status: str
    content_json: Dict[str, Any] = Field(default_factory=dict, alias="contentJson")
    pricing_json: Dict[str, Any] = Field(default_factory=dict, alias="pricingJson")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    # Flattened presentation helpers for frontend templates
    client_name: str = Field(default="", alias="clientName")
    client_company: str = Field(default="", alias="clientCompany")
    client_email: str = Field(default="", alias="clientEmail")
    industry: str = Field(default="Technology")
    deadline: str = Field(default="")
    total_budget: float = Field(default=0.0, alias="totalBudget")
    executive_summary: str = Field(default="", alias="executiveSummary")
    problem_understanding: str = Field(default="", alias="problemUnderstanding")
    objectives: List[str] = Field(default_factory=list)
    proposed_solution: str = Field(default="", alias="proposedSolution")
    deliverables: List[str] = Field(default_factory=list)
    scope_included: List[str] = Field(default_factory=list, alias="scopeIncluded")
    scope_excluded: List[str] = Field(default_factory=list, alias="scopeExcluded")
    assumptions_and_exclusions: List[str] = Field(default_factory=list, alias="assumptionsAndExclusions")
    timeline_summary: str = Field(default="", alias="timelineSummary")
    estimated_timeline: str = Field(default="", alias="estimatedTimeline")
    milestones: List[Any] = Field(default_factory=list)
    pricing_items: List[Any] = Field(default_factory=list, alias="pricingItems")
    pricing_notes: str = Field(default="", alias="pricingNotes")
    pricing_explanation: str = Field(default="", alias="pricingExplanation")
    payment_terms: str = Field(default="", alias="paymentTerms")
    client_responsibilities: List[str] = Field(default_factory=list, alias="clientResponsibilities")
    terms_and_conditions: str = Field(default="", alias="termsAndConditions")
    call_to_action: str = Field(default="", alias="callToAction")
    view_count: int = Field(default=0, alias="viewCount")

    @property
    def title(self) -> str:
        return self.project_title

    @property
    def brief(self) -> str:
        return self.project_brief

    @property
    def totalBudget(self) -> float:
        return self.total_budget

    @property
    def clientId(self) -> str:
        return self.client_id

    @property
    def clientName(self) -> str:
        return self.client_name

    @property
    def clientCompany(self) -> str:
        return self.client_company

    @property
    def executiveSummary(self) -> str:
        return self.executive_summary

    @property
    def viewCount(self) -> int:
        return self.view_count

    def __getattr__(self, item: str) -> Any:
        try:
            fields = object.__getattribute__(type(self), "model_fields")
            for field_name, field_info in fields.items():
                if (
                    getattr(field_info, "alias", None) == item
                    or getattr(field_info, "serialization_alias", None) == item
                    or getattr(field_info, "validation_alias", None) == item
                ):
                    return getattr(self, field_name)
        except Exception:
            pass
        raise AttributeError(f"'{type(self).__name__}' object has no attribute '{item}'")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ProposalListResponse(BaseModel):
    items: List[ProposalResponse]
    total: int
    skip: int
    limit: int
