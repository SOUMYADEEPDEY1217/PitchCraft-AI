from app.schemas.client import ClientBase, ClientCreate, ClientUpdate, ClientResponse, ClientListResponse
from app.schemas.proposal import (
    MilestoneSchema,
    PricingItemSchema,
    ProposalBase,
    ProposalCreate,
    ProposalUpdate,
    ProposalStatusUpdate,
    ProposalGenerateRequest,
    ProposalResponse,
    ProposalListResponse,
)
from app.schemas.pricing import (
    HoursByPhase,
    ExpenseItem,
    PricingCalculateRequest,
    PricingCalculateResponse,
)
from app.schemas.ai import (
    AiHealthResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    FollowUpRequest,
    FollowUpResponse,
)
from app.schemas.dashboard import DashboardStatsResponse, MonthlyRevenueItem
from app.schemas.generation_history import (
    AIGenerationHistoryCreate,
    AIGenerationHistoryResponse,
)

__all__ = [
    "ClientBase",
    "ClientCreate",
    "ClientUpdate",
    "ClientResponse",
    "ClientListResponse",
    "MilestoneSchema",
    "PricingItemSchema",
    "ProposalBase",
    "ProposalCreate",
    "ProposalUpdate",
    "ProposalStatusUpdate",
    "ProposalGenerateRequest",
    "ProposalResponse",
    "ProposalListResponse",
    "HoursByPhase",
    "ExpenseItem",
    "PricingCalculateRequest",
    "PricingCalculateResponse",
    "AiHealthResponse",
    "CoverLetterRequest",
    "CoverLetterResponse",
    "FollowUpRequest",
    "FollowUpResponse",
    "DashboardStatsResponse",
    "MonthlyRevenueItem",
    "AIGenerationHistoryCreate",
    "AIGenerationHistoryResponse",
]
