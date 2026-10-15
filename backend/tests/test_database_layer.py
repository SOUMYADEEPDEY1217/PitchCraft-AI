"""
Comprehensive Database Layer Tests for PitchCraft AI.
Tests SQLAlchemy 2 models, foreign keys, cascades, Alembic schema structures,
search/filtering queries, session rollback handling, and persistence.
"""

import pytest
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from app.models.client import Client
from app.models.proposal import Proposal
from app.models.generation_history import AIGenerationHistory
from app.services.client_service import client_service
from app.services.proposal_service import proposal_service
from app.schemas.client import ClientCreate, ClientUpdate
from app.schemas.proposal import ProposalCreate, ProposalUpdate
from app.core.exceptions import ConflictError, NotFoundError


def test_client_crud_and_persistence(db):
    """Verifies Client model creation, querying, update, and database persistence."""
    client_in = ClientCreate(
        name="Elena Rostova",
        company="Nordic Roast Co.",
        email="elena.rostova@nordicroast.com",
        phone="+44 20 7946 0912",
        website="https://nordicroast.com",
        industry="E-Commerce",
        status="active",
        notes="Premium coffee brand",
    )
    created = client_service.create_client(db, client_in)
    assert created.id is not None
    assert created.name == "Elena Rostova"
    assert created.status == "active"

    # Query directly from DB
    queried = db.query(Client).filter(Client.id == created.id).first()
    assert queried is not None
    assert queried.company == "Nordic Roast Co."
    assert queried.created_at is not None
    assert queried.updated_at is not None

    # Update
    update_in = ClientUpdate(company="Nordic Roast Global", notes="Updated notes")
    updated = client_service.update_client(db, created.id, update_in)
    assert updated.company == "Nordic Roast Global"
    assert updated.notes == "Updated notes"

    # Verify persistence
    db.expire_all()
    queried_again = db.query(Client).filter(Client.id == created.id).first()
    assert queried_again.company == "Nordic Roast Global"


def test_proposal_crud_with_json_and_relationships(db, sample_client):
    """Tests Proposal model with structured content_json and pricing_json."""
    proposal_in = ProposalCreate(
        clientId=sample_client.id,
        title="Automated Logistics Roster",
        brief="Real-time driver roster system",
        serviceCategory="full_stack",
        currency="USD",
        tone="technical",
        status="draft",
        totalBudget=16500.0,
        deadline="2026-12-10",
        executiveSummary="Full logistics rebuild",
        objectives=["Sub-second sync", "Offline caching"],
        pricingItems=[
            {"id": "p1", "description": "Core API", "hoursOrUnits": 50, "rate": 120, "total": 6000},
            {"id": "p2", "description": "UI Grid", "hoursOrUnits": 87.5, "rate": 120, "total": 10500},
        ],
    )
    created = proposal_service.create_proposal(db, proposal_in)
    assert created.id is not None
    assert created.title == "Automated Logistics Roster"
    assert created.totalBudget == 16500.0
    assert len(created.objectives) == 2

    # Query from DB and check relationship back to client
    orm_prop = db.query(Proposal).filter(Proposal.id == created.id).first()
    assert orm_prop is not None
    assert orm_prop.client is not None
    assert orm_prop.client.name == sample_client.name
    assert isinstance(orm_prop.content_json, dict)
    assert isinstance(orm_prop.pricing_json, dict)


def test_safe_deletion_behavior_for_clients(db, sample_client, sample_proposal):
    """
    Requirement 8: Safe deletion behavior for clients with proposals.
    Must block deletion if force=False and proposals exist.
    Must succeed cleanly if force=True.
    """
    # 1. Attempt to delete client with linked proposals without force
    with pytest.raises(ConflictError) as exc_info:
        client_service.delete_client(db, sample_client.id, force=False)
    assert "proposal(s) are linked to them" in str(exc_info.value.message)

    # Verify client and proposal still exist
    assert db.query(Client).filter(Client.id == sample_client.id).count() == 1
    assert db.query(Proposal).filter(Proposal.id == sample_proposal.id).count() == 1

    # 2. Delete with force=True
    deleted = client_service.delete_client(db, sample_client.id, force=True)
    assert deleted is True

    # Verify both client and cascading proposals are cleanly removed
    assert db.query(Client).filter(Client.id == sample_client.id).count() == 0
    assert db.query(Proposal).filter(Proposal.id == sample_proposal.id).count() == 0


def test_ai_generation_history_cascade(db, sample_client, sample_proposal):
    """Tests AIGenerationHistory record and foreign key behavior when proposal is deleted."""
    history = AIGenerationHistory(
        id="gen-test-01",
        proposal_id=sample_proposal.id,
        model_name="llama3.2",
        generation_type="proposal_full",
        duration_ms=3420,
        status="success",
    )
    db.add(history)
    db.commit()

    # Query history
    record = db.query(AIGenerationHistory).filter(AIGenerationHistory.id == "gen-test-01").first()
    assert record is not None
    assert record.proposal_id == sample_proposal.id

    # Delete proposal
    proposal_service.delete_proposal(db, sample_proposal.id)

    # Generation history foreign key is ondelete="SET NULL", so record is preserved with proposal_id NULL
    db.expire_all()
    record_after = db.query(AIGenerationHistory).filter(AIGenerationHistory.id == "gen-test-01").first()
    assert record_after is not None
    assert record_after.proposal_id is None


def test_search_and_filter_queries(db, sample_client, sample_proposal):
    """Tests search, filtering, and sorting queries across proposals and clients."""
    # 1. Search proposal by title
    props, count = proposal_service.get_proposals(db, search="Payment API")
    assert count >= 1
    assert any("Payment API" in p.title for p in props)

    # 2. Filter proposal by status
    props_status, count_status = proposal_service.get_proposals(db, status="in_review")
    assert count_status >= 1
    assert all(p.status == "in_review" for p in props_status)

    # 3. Filter proposal by nonexistent status
    props_none, count_none = proposal_service.get_proposals(db, status="declined")
    assert count_none == 0

    # 4. Search clients
    clients, c_count = client_service.get_clients(db, search="Smith")
    assert c_count >= 1
    assert any("Smith" in c.name for c in clients)


def test_dashboard_stats_computed_from_db(db, sample_client):
    """Tests that real metrics are dynamically calculated from actual database records."""
    # Create 2 proposals: 1 draft ($5,000), 1 accepted ($15,000)
    p_draft = Proposal(
        id="p-dash-1",
        client_id=sample_client.id,
        project_title="Draft App",
        service_category="web_development",
        status="draft",
        content_json={"executiveSummary": "Draft summary"},
        pricing_json={"totalBudget": 5000.0},
    )
    p_accepted = Proposal(
        id="p-dash-2",
        client_id=sample_client.id,
        project_title="Accepted App",
        service_category="ui_ux_design",
        status="accepted",
        content_json={"executiveSummary": "Accepted summary"},
        pricing_json={"totalBudget": 15000.0},
    )
    db.add_all([p_draft, p_accepted])
    db.commit()

    stats = proposal_service.get_dashboard_stats(db)
    assert stats.total_proposals == 2
    assert stats.draft_count == 1
    assert stats.accepted_count == 1
    assert stats.total_quoted_value == 20000.0
    assert stats.total_won_value == 15000.0
    assert stats.win_rate_percent == 50.0
    assert stats.clients_count >= 1


def test_database_session_rollback_on_error(db):
    """Verifies session rollback behavior when an integrity violation occurs."""
    # Attempt to insert a client with duplicate email if unique or invalid
    client1 = Client(
        id="cli-u-1",
        name="Unique One",
        company="Co 1",
        email="unique@co.com",
    )
    db.add(client1)
    db.commit()

    # Attempt to insert duplicate primary key
    client_dup = Client(
        id="cli-u-1",
        name="Unique Duplicate",
        company="Co 2",
        email="other@co.com",
    )
    db.add(client_dup)
    with pytest.raises(IntegrityError):
        db.commit()

    # Rollback must leave session clean
    db.rollback()
    assert db.query(Client).filter(Client.id == "cli-u-1").count() == 1
