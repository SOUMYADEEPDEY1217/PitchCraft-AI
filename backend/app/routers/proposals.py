"""
Proposals CRUD, AI generation, status transitions, and PDF export endpoints.
Enforces strict user-level data isolation on every endpoint.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict, Field

from app.database import get_db
from app.models.user import User
from app.core.auth_dependency import get_current_user
from app.schemas.proposal import (
    ProposalCreate,
    ProposalUpdate,
    ProposalStatusUpdate,
    ProposalGenerateRequest,
    ProposalResponse,
)
from app.services.proposal_service import proposal_service
from app.services.pdf_service import pdf_service


class ProposalSectionRegenerateBody(BaseModel):
    section_key: str = Field(..., alias="sectionKey")
    instructions: Optional[str] = None
    model: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


router = APIRouter(prefix="/proposals", tags=["Proposals"])


@router.get("", response_model=List[ProposalResponse], status_code=status.HTTP_200_OK)
def list_proposals(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = Query(None, description="Search title, client name, or company"),
    status: Optional[str] = Query(None, description="Filter by status: draft, sent, in_review, accepted, declined"),
    service_category: Optional[str] = Query(None, description="Filter by service category"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List proposals with searching, filtering, and sorting strictly for the authenticated user.
    """
    items, _ = proposal_service.get_proposals(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        search=search,
        status=status,
        service_category=service_category,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return items


@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(
    proposal_in: ProposalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new proposal associated with authenticated user.
    """
    return proposal_service.create_proposal(db, proposal_in, user_id=current_user.id)


@router.post("/generate", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
async def generate_proposal(
    req: ProposalGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Synthesize an entire proposal from client requirements via Ollama and persist under user account.
    """
    return await proposal_service.generate_and_save_proposal(db, req, user_id=current_user.id)


@router.get("/{proposal_id}", response_model=ProposalResponse, status_code=status.HTTP_200_OK)
def get_proposal(
    proposal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get proposal by ID with ownership verification and increment view count.
    """
    return proposal_service.get_proposal_by_id(db, proposal_id, user_id=current_user.id)


@router.put("/{proposal_id}", response_model=ProposalResponse, status_code=status.HTTP_200_OK)
def update_proposal(
    proposal_id: str,
    proposal_in: ProposalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing user-owned proposal.
    """
    return proposal_service.update_proposal(db, proposal_id, proposal_in, user_id=current_user.id)


@router.post("/{proposal_id}/regenerate-section", response_model=ProposalResponse, status_code=status.HTTP_200_OK)
async def regenerate_proposal_section(
    proposal_id: str,
    body: ProposalSectionRegenerateBody,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Selective Section Regeneration on user-owned proposal.
    """
    return await proposal_service.regenerate_proposal_section(
        db=db,
        proposal_id=proposal_id,
        section_key=body.section_key,
        instructions=body.instructions,
        model=body.model,
        user_id=current_user.id,
    )


@router.patch("/{proposal_id}/status", response_model=ProposalResponse, status_code=status.HTTP_200_OK)
def update_proposal_status(
    proposal_id: str,
    status_in: ProposalStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update proposal review status for user-owned proposal.
    """
    return proposal_service.update_status(db, proposal_id, status_in.status, user_id=current_user.id)


@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a user-owned proposal by ID.
    """
    proposal_service.delete_proposal(db, proposal_id, user_id=current_user.id)
    return None


@router.get("/{proposal_id}/pdf", status_code=status.HTTP_200_OK)
def download_proposal_pdf(
    proposal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Export and stream an executive PDF with ownership check.
    Prevents cross-user export leaks.
    """
    proposal = proposal_service.get_proposal_by_id(db, proposal_id, user_id=current_user.id)
    pdf_bytes = pdf_service.generate_proposal_pdf(proposal)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="proposal-{proposal.id}.pdf"',
            "Content-Type": "application/pdf",
        },
    )
