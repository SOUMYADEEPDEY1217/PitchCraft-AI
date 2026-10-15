"""
Pytest configuration and database fixtures for FastAPI testing.
"""

import sys
import os
import pytest

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, get_db
from app.models.client import Client
from app.models.proposal import Proposal

# In-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def sample_client(db):
    c = Client(
        id="cli-test-1",
        name="Alex Smith",
        company="Smith Ventures",
        email="alex@smithventures.com",
        phone="+1 555-0123",
        industry="FinTech",
        status="active",
        notes="High-priority FinTech client",
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@pytest.fixture(scope="function")
def sample_proposal(db, sample_client):
    content_json = {
        "clientName": sample_client.name,
        "clientCompany": sample_client.company,
        "clientEmail": sample_client.email,
        "industry": sample_client.industry,
        "deadline": "2026-11-30",
        "executiveSummary": "Modernizing API payment gateway.",
        "objectives": ["Sub-second settlement", "PCI compliance"],
        "proposedSolution": "React front-end with secure tokenization.",
        "deliverables": ["Tokenization service", "Audit logs"],
        "scopeIncluded": ["UI dashboard", "Stripe connector"],
        "scopeExcluded": ["Legacy mainframe migration"],
        "timelineSummary": "4-Week sprint",
        "milestones": [
            {"id": "m1", "title": "Phase 1: Architecture", "duration": "Week 1", "amount": 5000.0},
            {"id": "m2", "title": "Phase 2: Core Engineering", "duration": "Weeks 2–3", "amount": 6000.0},
            {"id": "m3", "title": "Phase 3: QA & Cutover", "duration": "Week 4", "amount": 4000.0},
        ],
        "termsAndConditions": "All IP transfers upon final settlement.",
        "callToAction": "Accept this proposal to secure sprint availability.",
        "viewCount": 2,
    }
    pricing_json = {
        "totalBudget": 15000.0,
        "pricingItems": [
            {"id": "p1", "description": "Architecture & Specs", "hoursOrUnits": 30.0, "rate": 125.0, "total": 3750.0},
            {"id": "p2", "description": "Core Implementation", "hoursOrUnits": 70.0, "rate": 125.0, "total": 8750.0},
            {"id": "p3", "description": "QA & Deployment", "hoursOrUnits": 20.0, "rate": 125.0, "total": 2500.0},
        ],
        "paymentTerms": "50% upfront, 25% midpoint, 25% upon final delivery. Net 15.",
    }

    p = Proposal(
        id="prop-test-1",
        client_id=sample_client.id,
        project_title="FinTech Payment API Integration",
        project_brief="Modernizing API payment gateway.",
        service_category="full_stack",
        currency="USD",
        tone="consultative",
        status="in_review",
        content_json=content_json,
        pricing_json=pricing_json,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
