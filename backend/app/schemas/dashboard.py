"""
Pydantic v2 schemas for Dashboard analytics and statistics.
"""

from typing import List, Dict
from pydantic import BaseModel


class MonthlyRevenueItem(BaseModel):
    month: str
    quoted: float
    won: float


class DashboardStatsResponse(BaseModel):
    total_proposals: int
    draft_count: int
    sent_count: int
    in_review_count: int
    accepted_count: int
    declined_count: int
    total_quoted_value: float
    total_won_value: float
    win_rate_percent: float
    active_pipeline_count: int
    clients_count: int
    monthly_data: List[MonthlyRevenueItem]
