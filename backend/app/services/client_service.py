"""
Client CRM service layer with safe deletion handling and database transactions.
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.client import Client
from app.models.proposal import Proposal
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from app.core.exceptions import NotFoundError, ConflictError
from app.core.logging import logger


class ClientService:
    @staticmethod
    def get_clients(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Tuple[List[ClientResponse], int]:
        query = db.query(Client)

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

        total = query.count()
        clients = query.order_by(Client.created_at.desc()).offset(skip).limit(limit).all()

        results = []
        for c in clients:
            results.append(ClientService._to_response(db, c))

        return results, total

    @staticmethod
    def get_client_by_id(db: Session, client_id: str) -> ClientResponse:
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise NotFoundError("Client", client_id)
        return ClientService._to_response(db, client)

    @staticmethod
    def create_client(db: Session, client_in: ClientCreate) -> ClientResponse:
        existing = db.query(Client).filter(Client.email == client_in.email).first()
        if existing:
            raise ConflictError(f"A client with email '{client_in.email}' already exists.")

        client = Client(
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

        logger.info(f"Created new CRM client {client.id} ({client.name} - {client.company})")
        return ClientService._to_response(db, client)

    @staticmethod
    def update_client(db: Session, client_id: str, client_in: ClientUpdate) -> ClientResponse:
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise NotFoundError("Client", client_id)

        update_data = client_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(client, field, value)

        db.commit()
        db.refresh(client)
        logger.info(f"Updated CRM client {client.id}")
        return ClientService._to_response(db, client)

    @staticmethod
    def delete_client(db: Session, client_id: str, force: bool = False) -> bool:
        """
        Safe deletion behavior:
        If force=False and client has linked proposals, blocks deletion with ConflictError.
        If force=True, cascades deletion safely.
        """
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise NotFoundError("Client", client_id)

        proposal_count = db.query(Proposal).filter(Proposal.client_id == client.id).count()
        if proposal_count > 0 and not force:
            raise ConflictError(
                f"Cannot delete client '{client.name}' because {proposal_count} proposal(s) are linked to them. "
                f"Archive or delete the proposals first, or use force=true to cascade delete."
            )

        db.delete(client)
        db.commit()
        logger.info(f"Safely deleted client {client_id} (had {proposal_count} proposals, force={force})")
        return True

    @staticmethod
    def _to_response(db: Session, client: Client) -> ClientResponse:
        proposals = db.query(Proposal).filter(Proposal.client_id == client.id).all()
        total_quoted = sum(p.pricing_json.get("totalBudget", 0.0) for p in proposals)
        total_paid = sum(
            p.pricing_json.get("totalBudget", 0.0)
            for p in proposals
            if p.status == "accepted"
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
            total_quoted=round(total_quoted, 2),
            total_paid=round(total_paid, 2),
            proposals_count=len(proposals),
            created_at=client.created_at,
            updated_at=client.updated_at,
        )


client_service = ClientService()
