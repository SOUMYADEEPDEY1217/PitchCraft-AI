"""
Clients CRM endpoints with strict multi-tenant isolation.
Ensures every client record is linked to and accessible only by its authenticated owner.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.core.auth_dependency import get_current_user
from app.models.client import Client
from app.models.proposal import Proposal
from app.schemas.client import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
)
from app.schemas.proposal import ProposalResponse
from app.services.proposal_service import proposal_service
from app.core.exceptions import NotFoundError, ConflictError
from app.core.logging import logger

router = APIRouter(prefix="/clients", tags=["Clients CRM"])


@router.get("", response_model=List[ClientResponse], status_code=status.HTTP_200_OK)
def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = Query(None, description="Search by name, company, or email"),
    status: Optional[str] = Query(None, description="Filter by status: lead, active, past"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List clients with search, filtering, and pagination strictly for authenticated user.
    """
    query = db.query(Client).filter(Client.user_id == current_user.id)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Client.name.ilike(search_filter),
                Client.company.ilike(search_filter),
                Client.email.ilike(search_filter),
            )
        )

    if status and status != "all":
        query = query.filter(Client.status == status)

    clients = query.order_by(Client.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for c in clients:
        p_count = db.query(Proposal).filter(
            Proposal.client_id == c.id,
            Proposal.user_id == current_user.id,
        ).count()
        client_dict = ClientResponse(
            id=c.id,
            name=c.name,
            company=c.company,
            email=c.email,
            phone=c.phone,
            website=c.website,
            industry=c.industry,
            status=c.status,
            notes=c.notes,
            total_quoted=c.total_quoted,
            total_paid=c.total_paid,
            proposals_count=p_count,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        result.append(client_dict)

    return result


@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    client_in: ClientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new client in the CRM owned by the authenticated user.
    """
    existing = (
        db.query(Client)
        .filter(Client.email == client_in.email, Client.user_id == current_user.id)
        .first()
    )
    if existing:
        raise ConflictError(f"A client with email '{client_in.email}' already exists in your CRM.")

    client = Client(
        user_id=current_user.id,
        name=client_in.name,
        company=client_in.company,
        email=client_in.email,
        phone=client_in.phone,
        website=client_in.website,
        industry=client_in.industry,
        status=client_in.status,
        notes=client_in.notes,
    )
    db.add(client)
    db.commit()
    db.refresh(client)

    logger.info(f"User {current_user.id} created client {client.id} ({client.name})")
    return ClientResponse(
        id=client.id,
        name=client.name,
        company=client.company,
        email=client.email,
        phone=client.phone,
        website=client.website,
        industry=client.industry,
        status=client.status,
        notes=client.notes,
        total_quoted=client.total_quoted,
        total_paid=client.total_paid,
        proposals_count=0,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.get("/{client_id}", response_model=ClientResponse, status_code=status.HTTP_200_OK)
def get_client(
    client_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get client details by ID with ownership verification.
    """
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == current_user.id)
        .first()
    )
    if not client:
        raise NotFoundError("Client", client_id)

    p_count = (
        db.query(Proposal)
        .filter(Proposal.client_id == client.id, Proposal.user_id == current_user.id)
        .count()
    )
    return ClientResponse(
        id=client.id,
        name=client.name,
        company=client.company,
        email=client.email,
        phone=client.phone,
        website=client.website,
        industry=client.industry,
        status=client.status,
        notes=client.notes,
        total_quoted=client.total_quoted,
        total_paid=client.total_paid,
        proposals_count=p_count,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.put("/{client_id}", response_model=ClientResponse, status_code=status.HTTP_200_OK)
def update_client(
    client_id: str,
    client_in: ClientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update client details with ownership check.
    """
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == current_user.id)
        .first()
    )
    if not client:
        raise NotFoundError("Client", client_id)

    if client_in.name is not None:
        client.name = client_in.name
    if client_in.company is not None:
        client.company = client_in.company
    if client_in.email is not None:
        client.email = client_in.email
    if client_in.phone is not None:
        client.phone = client_in.phone
    if client_in.website is not None:
        client.website = client_in.website
    if client_in.industry is not None:
        client.industry = client_in.industry
    if client_in.status is not None:
        client.status = client_in.status
    if client_in.notes is not None:
        client.notes = client_in.notes

    db.commit()
    db.refresh(client)

    p_count = (
        db.query(Proposal)
        .filter(Proposal.client_id == client.id, Proposal.user_id == current_user.id)
        .count()
    )
    return ClientResponse(
        id=client.id,
        name=client.name,
        company=client.company,
        email=client.email,
        phone=client.phone,
        website=client.website,
        industry=client.industry,
        status=client.status,
        notes=client.notes,
        total_quoted=client.total_quoted,
        total_paid=client.total_paid,
        proposals_count=p_count,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete client record with ownership check.
    """
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == current_user.id)
        .first()
    )
    if not client:
        raise NotFoundError("Client", client_id)

    db.delete(client)
    db.commit()
    logger.info(f"User {current_user.id} deleted client {client_id}")
    return None


@router.get("/{client_id}/proposals", response_model=List[ProposalResponse], status_code=status.HTTP_200_OK)
def get_client_proposals(
    client_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve all proposals linked to a client, strictly scoped to authenticated owner.
    """
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == current_user.id)
        .first()
    )
    if not client:
        raise NotFoundError("Client", client_id)

    proposals = (
        db.query(Proposal)
        .filter(Proposal.client_id == client_id, Proposal.user_id == current_user.id)
        .order_by(Proposal.created_at.desc())
        .all()
    )

    return [proposal_service._to_response(p) for p in proposals]
