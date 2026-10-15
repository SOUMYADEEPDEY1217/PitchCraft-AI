"""
Dashboard stats and pipeline analytics router.
Returns genuine user-isolated KPIs, pipeline distribution, and monthly deal volume.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.auth_dependency import get_current_user
from app.schemas.dashboard import DashboardStatsResponse
from app.services.proposal_service import proposal_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard Analytics"])


@router.get("/stats", response_model=DashboardStatsResponse, status_code=status.HTTP_200_OK)
def get_dashboard_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns aggregated KPIs, proposal pipeline distribution, and monthly deal volume
    calculated strictly for the authenticated user account.
    """
    return proposal_service.get_dashboard_stats(db, user_id=current_user.id)
