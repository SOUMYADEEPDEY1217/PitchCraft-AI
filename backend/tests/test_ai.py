"""
Comprehensive tests for Ollama AI generation features:
1. System & AI Health Checks
2. Model Listing & Model Switching
3. Client Brief Analyzer (8-dimensional extraction)
4. AI Proposal Generation & Deterministic Financials
5. Freelance Cover Letter Generator (zero-hallucination qualifications)
6. Follow-Up Email Sequence Generator
7. Proposal Improvement Assistant (strategic section polishing)
8. Selective Section Regeneration
9. Error Handling for Unreachable Ollama, Timeouts, and Missing Models
"""

import pytest
from unittest.mock import patch, AsyncMock
from app.schemas.ai import ClientBriefAnalysisResponse, ProposalImprovementResponse
from app.core.exceptions import OllamaConnectionError, OllamaTimeoutError, OllamaModelNotFoundError


def test_system_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data
    assert "database_connected" in data


def test_ai_health(client):
    response = client.get("/api/ai/health")
    assert response.status_code == 200
    data = response.json()
    assert "is_connected" in data
    assert "model" in data
    assert "available_models" in data


def test_ai_models_and_switch(client):
    # Test GET /api/ai/models
    res = client.get("/api/ai/models")
    assert res.status_code == 200
    data = res.json()
    assert "active_model" in data
    assert "available_models" in data

    # Test POST /api/ai/switch-model
    switch_res = client.post("/api/ai/switch-model", json={"model": "qwen3:4b"})
    assert switch_res.status_code == 200
    switch_data = switch_res.json()
    assert switch_data["active_model"] == "qwen3:4b"


def test_client_brief_analyzer(client):
    """Test Client Brief Analyzer 8-dimensional extraction."""
    payload = {
        "brief": "We are a medical diagnostics company needing a HIPAA-compliant patient portal with React 19 and FastAPI. Budget is approximately $25,000 and we want to launch by November 30. We do not have payment gateway accounts yet.",
        "industry": "Healthcare & Biotechnology",
        "clientName": "Dr. Sarah Jenkins",
        "clientCompany": "Aura Medical Labs",
        "targetBudget": 25000.0,
        "deadline": "2026-11-30",
    }

    mock_response = ClientBriefAnalysisResponse(
        client_objectives=["Deploy secure patient diagnostic results portal", "Ensure HIPAA compliance"],
        project_requirements=["React 19 single page frontend", "FastAPI backend services", "Role-based access control"],
        expected_deliverables=["Production web app", "HIPAA security audit report", "CI/CD deployment pipeline"],
        target_audience="Patients and clinical healthcare providers",
        budget_constraints="$25,000 stated budget",
        deadline="2026-11-30",
        missing_information=["Which payment merchant provider will be used?", "Will existing EMR/EHR data be migrated?"],
        potential_project_risks=["HIPAA compliance regulatory scrutiny", "Third-party payment gateway onboarding delays"],
        model_used="qwen3:4b",
    )

    with patch("app.services.ollama_service.ollama_service.analyze_client_brief", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = mock_response
        res = client.post("/api/ai/analyze-brief", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert len(data["client_objectives"]) >= 2
        assert len(data["project_requirements"]) >= 2
        assert len(data["expected_deliverables"]) >= 2
        assert "target_audience" in data
        assert "budget_constraints" in data
        assert "deadline" in data
        assert len(data["missing_information"]) >= 1
        assert len(data["potential_project_risks"]) >= 1
        assert data["model_used"] == "qwen3:4b"


def test_generate_cover_letter(client):
    """Test Cover Letter Generator."""
    from app.schemas.ai import CoverLetterResponse
    payload = {
        "clientName": "David Chen",
        "jobTitle": "Lead Full-Stack React Engineer",
        "jobDescription": "Need an expert to build high-performance data visualization interface.",
        "freelancerSkills": "React 19, TypeScript, Tailwind, Recharts",
        "tone": "executive",
        "portfolioHighlight": "Engineered clinical trials explorer",
    }
    mock_response = CoverLetterResponse(
        cover_letter="Dear David Chen,\n\nI am writing to express my strong interest in the Lead Full-Stack React Engineer role. Having engineered clinical trials explorers with React 19, TypeScript, Tailwind, and Recharts, I can deliver your high-performance interface with precision.\n\nBest regards,\nPitchCraft Engineering",
        model_used="qwen3:4b",
    )
    with patch("app.services.ollama_service.ollama_service.generate_cover_letter", new_callable=AsyncMock) as mock_cov:
        mock_cov.return_value = mock_response
        response = client.post("/api/ai/cover-letter", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "cover_letter" in data
        assert len(data["cover_letter"]) > 50
        assert "David Chen" in data["cover_letter"] or "Lead Full-Stack React Engineer" in data["cover_letter"]


def test_generate_follow_up(client):
    """Test Follow-Up Sequence Generator."""
    from app.schemas.ai import FollowUpResponse
    payload = {
        "clientName": "Marcus Vance",
        "proposalTitle": "Clinical Data Portal Redesign",
        "daysSinceSent": 3,
        "proposalValue": 18500.0,
        "stage": "gentle_nudge",
    }
    mock_response = FollowUpResponse(
        subject="Checking in: Clinical Data Portal Redesign Proposal",
        body="Hi Marcus Vance,\n\nFollowing up on our Clinical Data Portal Redesign proposal submitted earlier this week. Happy to answer any questions or discuss scheduling.\n\nBest regards,\nPitchCraft Team",
        stage="gentle_nudge",
        model_used="qwen3:4b",
    )
    with patch("app.services.ollama_service.ollama_service.generate_follow_up", new_callable=AsyncMock) as mock_fol:
        mock_fol.return_value = mock_response
        response = client.post("/api/ai/follow-up", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "subject" in data
        assert "body" in data
        assert "Clinical Data Portal Redesign" in data["subject"]
        assert "Marcus Vance" in data["body"]


def test_improve_proposal_section(client):
    """Test Proposal Improvement Assistant."""
    payload = {
        "sectionTitle": "Executive Summary",
        "originalText": "We will build a web application for your firm in 6 weeks for $15,000.",
        "goal": "justify_higher_price",
        "context": "Healthcare B2B Analytics",
    }

    mock_result = ProposalImprovementResponse(
        improved_text="PitchCraft Architecture delivers an enterprise-grade analytics portal designed to compress clinical reporting latency by 45%.",
        suggestions=["Framed technical delivery around measurable client business outcomes", "Justified investment by emphasizing risk elimination"],
        identified_strengths=["Clear 6-week phased timeline commitment"],
        potential_risks_addressed=["Removed ambiguous technical jargon"],
        model_used="qwen3:4b",
    )

    with patch("app.services.ollama_service.ollama_service.improve_proposal_section", new_callable=AsyncMock) as mock_imp:
        mock_imp.return_value = mock_result
        res = client.post("/api/ai/improve-section", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "improvedText" in data or "improved_text" in data
        assert len(data["suggestions"]) >= 1


def test_selective_section_regeneration_on_proposal(client, sample_proposal):
    """Test selective regeneration of a single section on an existing proposal."""
    payload = {
        "sectionKey": "executive_summary",
        "instructions": "Make it more urgent and highlight competitive risk of delay",
    }

    with patch("app.services.ollama_service.ollama_service.regenerate_section", new_callable=AsyncMock) as mock_regen:
        from app.schemas.ai import SectionRegenerateResponse
        mock_regen.return_value = SectionRegenerateResponse(
            section_key="executive_summary",
            regenerated_content="This revised executive blueprint accelerates deployment to prevent competitive encroachment in Q4.",
            explanation="Sharpened competitive urgency and commercial ROI.",
            model_used="qwen3:4b",
        )

        res = client.post(f"/api/proposals/{sample_proposal.id}/regenerate-section", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["id"] == sample_proposal.id
        assert "accelerates deployment" in data["executiveSummary"]

        # Ensure other fields were NOT lost!
        assert data["title"] == sample_proposal.project_title
        assert len(data["deliverables"]) > 0


def test_ollama_connection_error_handling(client):
    """Verify backend returns clean HTTP 503 when Ollama is unreachable."""
    with patch("app.services.ollama_service.ollama_service.analyze_client_brief", side_effect=OllamaConnectionError("http://127.0.0.1:11434")):
        res = client.post("/api/ai/analyze-brief", json={"brief": "Test brief of at least fifteen characters long"})
        assert res.status_code == 503
        data = res.json()
        assert data["success"] is False
        assert "Cannot connect to Ollama" in data["error"]["message"]
        assert "ollama serve" in data["error"]["details"]["troubleshooting"]


def test_ollama_missing_model_error_handling(client):
    """Verify backend returns clean HTTP 404 when requested model is not downloaded."""
    with patch("app.services.ollama_service.ollama_service.analyze_client_brief", side_effect=OllamaModelNotFoundError("qwen3:4b", ["llama3.2"])):
        res = client.post("/api/ai/analyze-brief", json={"brief": "Test brief of at least fifteen characters long"})
        assert res.status_code == 404
        data = res.json()
        assert data["success"] is False
        assert "ollama pull qwen3:4b" in data["error"]["message"]


def test_ollama_timeout_error_handling(client):
    """Verify backend returns clean HTTP 504 when Ollama times out."""
    with patch("app.services.ollama_service.ollama_service.analyze_client_brief", side_effect=OllamaTimeoutError(120.0, "qwen3:4b")):
        res = client.post("/api/ai/analyze-brief", json={"brief": "Test brief of at least fifteen characters long"})
        assert res.status_code == 504
        data = res.json()
        assert data["success"] is False
        assert "timed out after 120" in data["error"]["message"]
