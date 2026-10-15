"""
Pydantic v2 schemas for Ollama AI operations.
Strict validation for structured inference pipelines with Qwen3:4b.
"""

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field


class AiHealthResponse(BaseModel):
    is_connected: bool
    service: str
    model: str
    available_models: List[str]
    latency_ms: Optional[float] = None
    message: Optional[str] = None


class ModelSwitchRequest(BaseModel):
    model: str = Field(..., min_length=2, description="Target Ollama model name, e.g. qwen3:4b")


class ModelListResponse(BaseModel):
    active_model: str
    available_models: List[str]
    is_connected: bool


# --- 1. Client Brief Analyzer ---
class ClientBriefAnalysisRequest(BaseModel):
    brief: str = Field(..., min_length=15, description="Unstructured client RFP, job post, or client email brief")
    industry: Optional[str] = Field(default=None, description="Client industry or vertical")
    client_name: Optional[str] = Field(default=None, alias="clientName")
    client_company: Optional[str] = Field(default=None, alias="clientCompany")
    target_budget: Optional[float] = Field(default=None, alias="targetBudget")
    deadline: Optional[str] = Field(default=None)
    model: Optional[str] = Field(default=None, description="Optional override model name")

    model_config = ConfigDict(populate_by_name=True)


class ClientBriefAnalysisResponse(BaseModel):
    client_objectives: List[str] = Field(..., description="High-level commercial and strategic objectives of the client")
    project_requirements: List[str] = Field(..., description="Specific technical, functional, and design requirements")
    expected_deliverables: List[str] = Field(..., description="Concrete tangible work products expected by the client")
    target_audience: str = Field(..., description="Identified end-user demographic or target stakeholder persona")
    budget_constraints: str = Field(..., description="Explicit budget or clearly designated as unconfirmed assumption")
    deadline: str = Field(..., description="Extracted target delivery date or designated as unconfirmed assumption")
    missing_information: List[str] = Field(..., description="Ambiguities or critical discovery questions before kickoff")
    potential_project_risks: List[str] = Field(..., description="Identified execution risks, technical blockers, or scope creep hazards")
    model_used: str = Field(default="qwen3:4b")
    extracted_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)


# --- 2. Cover Letter Generator ---
class CoverLetterRequest(BaseModel):
    client_name: Optional[str] = Field(None, alias="clientName")
    job_title: str = Field(..., min_length=2, alias="jobTitle")
    job_description: str = Field(..., min_length=10, alias="jobDescription")
    freelancer_skills: str = Field(default="", alias="freelancerSkills")
    tone: str = Field(default="consultative")
    portfolio_highlight: Optional[str] = Field(None, alias="portfolioHighlight")
    model: Optional[str] = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)


class CoverLetterResponse(BaseModel):
    cover_letter: str
    model_used: str


# --- 3. Follow-Up Email Generator ---
class FollowUpRequest(BaseModel):
    client_name: str = Field(..., alias="clientName")
    proposal_title: str = Field(..., alias="proposalTitle")
    days_since_sent: int = Field(default=3, ge=0, alias="daysSinceSent")
    proposal_value: float = Field(default=10000.0, ge=0.0, alias="proposalValue")
    stage: str = Field(default="gentle_nudge")  # gentle_nudge, value_add, urgent_closeout, contract_signing
    model: Optional[str] = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)


class FollowUpResponse(BaseModel):
    subject: str
    body: str
    stage: str
    model_used: str = Field(default="qwen3:4b")


# --- 4. Proposal Improvement Assistant ---
class ProposalImprovementRequest(BaseModel):
    section_title: str = Field(..., alias="sectionTitle")
    original_text: str = Field(..., min_length=5, alias="originalText")
    goal: str = Field(
        default="justify_higher_price",
        description="Improvement goal: more_persuasive, justify_higher_price, clearer_scope, objection_proofing",
    )
    context: Optional[str] = Field(default=None, description="Optional project context or client industry")
    model: Optional[str] = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)


class ProposalImprovementResponse(BaseModel):
    improved_text: str = Field(..., alias="improvedText")
    suggestions: List[str] = Field(default_factory=list)
    identified_strengths: List[str] = Field(default_factory=list, alias="identifiedStrengths")
    potential_risks_addressed: List[str] = Field(default_factory=list, alias="potentialRisksAddressed")
    model_used: str = Field(default="qwen3:4b")

    model_config = ConfigDict(populate_by_name=True)


# --- 5. Selective Section Regeneration ---
class SectionRegenerateRequest(BaseModel):
    section_key: str = Field(
        ...,
        alias="sectionKey",
        description="Section key to regenerate: executive_summary, problem_understanding, proposed_solution, deliverables, scope_of_work, milestones, timeline_summary, pricing_explanation, assumptions_and_exclusions, terms_and_conditions, call_to_action",
    )
    proposal_id: Optional[str] = Field(default=None, alias="proposalId")
    project_title: Optional[str] = Field(default=None, alias="projectTitle")
    client_name: Optional[str] = Field(default=None, alias="clientName")
    client_company: Optional[str] = Field(default=None, alias="clientCompany")
    industry: Optional[str] = Field(default=None)
    tone: Optional[str] = Field(default="consultative")
    brief: Optional[str] = Field(default=None)
    target_budget: Optional[float] = Field(default=None, alias="targetBudget")
    currency: Optional[str] = Field(default="USD")
    deadline: Optional[str] = Field(default=None)
    instructions: Optional[str] = Field(default=None, description="Specific prompt directive for this section regeneration")
    current_content: Optional[Any] = Field(default=None, alias="currentContent")
    model: Optional[str] = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)


class SectionRegenerateResponse(BaseModel):
    section_key: str = Field(..., alias="sectionKey")
    regenerated_content: Any = Field(..., alias="regeneratedContent")
    explanation: str
    model_used: str

    model_config = ConfigDict(populate_by_name=True)
