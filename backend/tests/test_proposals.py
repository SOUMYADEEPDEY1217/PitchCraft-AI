"""
Tests for Proposals CRUD, generation, status update, and PDF export endpoints.
"""

def test_list_proposals(client, sample_proposal):
    response = client.get("/api/proposals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] == sample_proposal.id


def test_get_proposal_by_id(client, sample_proposal):
    initial_views = (sample_proposal.content_json or {}).get("viewCount", 0)
    response = client.get(f"/api/proposals/{sample_proposal.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_proposal.id
    assert data["title"] == sample_proposal.project_title
    # View count should increment
    assert data["viewCount"] == initial_views + 1


def test_create_proposal(client, sample_client):
    payload = {
        "title": "Mobile App Prototype",
        "clientName": sample_client.name,
        "clientCompany": sample_client.company,
        "clientId": sample_client.id,
        "industry": "Mobile & Consumer",
        "serviceCategory": "mobile_app",
        "currency": "USD",
        "totalBudget": 8000.0,
        "deadline": "2026-12-01",
        "tone": "bold",
        "status": "draft",
        "executiveSummary": "Rapid prototyping sprint for iOS and Android.",
        "objectives": ["Deliver Figma prototype", "User test with 10 testers"],
        "proposedSolution": "Flutter or React Native architecture.",
        "deliverables": ["Interactive prototype", "Specs"],
        "scopeIncluded": ["Design system", "Clickable prototype"],
        "scopeExcluded": ["Native backend API development"],
        "timelineSummary": "2-Week sprint",
        "milestones": [
            {"id": "m1", "title": "Discovery & UI", "duration": "Week 1", "amount": 4000.0},
            {"id": "m2", "title": "Prototype & Testing", "duration": "Week 2", "amount": 4000.0},
        ],
        "pricingItems": [
            {"id": "p1", "description": "UI Prototyping", "hoursOrUnits": 30.0, "rate": 130.0, "total": 3900.0},
            {"id": "p2", "description": "User Testing", "hoursOrUnits": 31.5, "rate": 130.0, "total": 4100.0},
        ],
        "paymentTerms": "50% upfront, 50% on prototype delivery. Net 15.",
        "termsAndConditions": "IP transfers on final settlement.",
        "callToAction": "Select Accept Proposal to schedule kickoff.",
    }
    response = client.post("/api/proposals", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["totalBudget"] == 8000.0
    assert data["status"] == "draft"


def test_generate_proposal(client):
    from unittest.mock import patch, AsyncMock

    req_payload = {
        "clientName": "Elena Rostova",
        "clientCompany": "Nordic Roast Co.",
        "projectTitle": "Custom Coffee Subscription Portal",
        "industry": "E-Commerce",
        "serviceCategory": "web_development",
        "currency": "USD",
        "targetBudget": 12000.0,
        "deadline": "2026-11-15",
        "tone": "consultative",
        "brief": "Client needs a headless subscription box builder with customer portal for recurring deliveries.",
    }

    mock_generated = {
        "project_title": "Custom Coffee Subscription Portal",
        "executive_summary": "Comprehensive subscription box portal with customer dashboard.",
        "objectives": ["Launch recurring delivery subscription portal", "Integrate automated billing"],
        "proposed_solution": "Modern headless architecture with secure customer portal.",
        "deliverables": ["Subscription portal", "Billing integration", "Admin management dashboard"],
        "scope_included": ["Portal frontend", "Stripe billing sync"],
        "scope_excluded": ["Physical packaging fulfillment"],
        "milestones": [
            {"id": "m1", "title": "Discovery & Architecture", "duration": "Week 1", "amount": 4000.0},
            {"id": "m2", "title": "Portal Implementation", "duration": "Weeks 2-3", "amount": 8000.0},
        ],
        "pricing_items": [
            {"id": "p1", "description": "Core Subscription Engine", "hoursOrUnits": 40, "rate": 150, "total": 6000.0},
            {"id": "p2", "description": "Client Portal & Dashboard", "hoursOrUnits": 40, "rate": 150, "total": 6000.0},
        ],
        "payment_terms": "50% upfront deposit, 50% upon milestone completion.",
        "terms_and_conditions": "All intellectual property transfers upon final balance settlement.",
        "call_to_action": "Click Accept Proposal to begin the discovery phase.",
    }

    with patch("app.services.ollama_service.ollama_service.generate_proposal_content", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_generated
        response = client.post("/api/proposals/generate", json=req_payload)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == req_payload["projectTitle"]
        assert data["totalBudget"] == 12000.0
        assert len(data["objectives"]) > 0
        assert len(data["milestones"]) > 0
        assert len(data["pricingItems"]) > 0


def test_update_proposal_status(client, sample_proposal):
    patch_payload = {"status": "accepted"}
    response = client.patch(f"/api/proposals/{sample_proposal.id}/status", json=patch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "accepted"


def test_export_proposal_pdf(client, sample_proposal):
    response = client.get(f"/api/proposals/{sample_proposal.id}/pdf")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 100
    # PDF files start with %PDF
    assert response.content.startswith(b"%PDF")


def test_delete_proposal(client, sample_proposal):
    response = client.delete(f"/api/proposals/{sample_proposal.id}")
    assert response.status_code == 204

    # Verify 404
    get_res = client.get(f"/api/proposals/{sample_proposal.id}")
    assert get_res.status_code == 404
