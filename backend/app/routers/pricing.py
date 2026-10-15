"""
Pricing calculation router with saved estimates management.
Enforces multi-tenant isolation for user-saved pricing calculations.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.models.user import User
from app.models.saved_pricing import SavedPricingEstimate
from app.core.auth_dependency import get_current_user
from app.schemas.pricing import PricingCalculateRequest, PricingCalculateResponse
from app.services.pricing_service import pricing_service


class SaveEstimateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    client_name: str = Field("", max_length=255)
    calculation: dict


class SavedEstimateResponse(BaseModel):
    id: str
    title: str
    client_name: str
    calculation: dict
    created_at: str


router = APIRouter(prefix="/pricing", tags=["Pricing Calculator"])


@router.post("/calculate", response_model=PricingCalculateResponse, status_code=status.HTTP_200_OK)
def calculate_project_pricing(request: PricingCalculateRequest):
    """
    Computes precise freelance quotations based on phased hours, expenses, contingency, and margin.
    """
    return pricing_service.calculate(request)


@router.get("/estimates", response_model=List[SavedEstimateResponse], status_code=status.HTTP_200_OK)
def list_saved_estimates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Lists saved pricing estimates strictly for authenticated user.
    """
    estimates = (
        db.query(SavedPricingEstimate)
        .filter(SavedPricingEstimate.user_id == current_user.id)
        .order_by(SavedPricingEstimate.created_at.desc())
        .all()
    )
    return [
        SavedEstimateResponse(
            id=e.id,
            title=e.title,
            client_name=e.client_name or "",
            calculation=e.calculation_json or {},
            created_at=e.created_at.isoformat() if e.created_at else "",
        )
        for e in estimates
    ]


@router.post("/estimates", response_model=SavedEstimateResponse, status_code=status.HTTP_201_CREATED)
def save_estimate(
    req: SaveEstimateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Saves a pricing calculation under authenticated user's account.
    """
    estimate = SavedPricingEstimate(
        user_id=current_user.id,
        title=req.title,
        client_name=req.client_name,
        calculation_json=req.calculation,
    )
    db.add(estimate)
    db.commit()
    db.refresh(estimate)

    return SavedEstimateResponse(
        id=estimate.id,
        title=estimate.title,
        client_name=estimate.client_name or "",
        calculation=estimate.calculation_json or {},
        created_at=estimate.created_at.isoformat(),
    )


@router.delete("/estimates/{estimate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estimate(
    estimate_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Deletes a saved pricing calculation with ownership check.
    """
    estimate = (
        db.query(SavedPricingEstimate)
        .filter(SavedPricingEstimate.id == estimate_id, SavedPricingEstimate.user_id == current_user.id)
        .first()
    )
    if not estimate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimate not found")

    db.delete(estimate)
    db.commit()
    return None
