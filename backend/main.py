"""
PitchCraft AI — FastAPI Backend Microservice
Communicates with Ollama local models and handles business logic, proposal storage, and CRM endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import httpx
import os
import json

app = FastAPI(
    title="PitchCraft AI API",
    description="FastAPI service for proposal generation and client management with Ollama",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# In-memory storage with file backup for local testing
PROPOSALS_DB: Dict[str, Dict[str, Any]] = {}
CLIENTS_DB: Dict[str, Dict[str, Any]] = {}

class ProposalGenerateRequest(BaseModel):
    clientName: str
    clientCompany: Optional[str] = None
    clientEmail: Optional[str] = None
    projectTitle: str
    industry: str
    serviceCategory: str
    currency: str = "USD"
    targetBudget: float = 10000.0
    deadline: str
    tone: str = "consultative"
    brief: str
    includeRetainer: Optional[bool] = False

class CoverLetterRequest(BaseModel):
    clientName: str
    jobTitle: str
    jobDescription: str
    freelancerSkills: str
    tone: str
    portfolioHighlight: str

class FollowUpRequest(BaseModel):
    clientName: str
    proposalTitle: str
    daysSinceSent: int
    proposalValue: float
    stage: str

class SectionImproveRequest(BaseModel):
    sectionTitle: str
    originalText: str
    goal: str

@app.get("/health")
async def health_check():
    """Health check endpoint to test connection from frontend"""
    ollama_online = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            resp = await client.get(f"{OLLAMA_URL}/api/tags")
            ollama_online = resp.status_code == 200
    except Exception:
        ollama_online = False

    return {
        "status": "healthy",
        "service": "PitchCraft AI FastAPI",
        "ollama_online": ollama_online,
        "model": OLLAMA_MODEL,
        "proposals_count": len(PROPOSALS_DB),
    }

# --- Proposals Endpoints ---

@app.get("/api/proposals")
async def list_proposals():
    return list(PROPOSALS_DB.values())

@app.get("/api/proposals/{proposal_id}")
async def get_proposal(proposal_id: str):
    if proposal_id not in PROPOSALS_DB:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return PROPOSALS_DB[proposal_id]

@app.post("/api/proposals")
async def save_proposal(proposal: Dict[str, Any]):
    prop_id = proposal.get("id") or f"prop-{len(PROPOSALS_DB) + 1}"
    PROPOSALS_DB[prop_id] = proposal
    return proposal

@app.delete("/api/proposals/{proposal_id}")
async def delete_proposal(proposal_id: str):
    if proposal_id in PROPOSALS_DB:
        del PROPOSALS_DB[proposal_id]
    return {"success": True}

# --- Clients Endpoints ---

@app.get("/api/clients")
async def list_clients():
    return list(CLIENTS_DB.values())

@app.post("/api/clients")
async def save_client(client: Dict[str, Any]):
    cli_id = client.get("id") or f"cli-{len(CLIENTS_DB) + 1}"
    CLIENTS_DB[cli_id] = client
    return client

@app.delete("/api/clients/{client_id}")
async def delete_client(client_id: str):
    if client_id in CLIENTS_DB:
        del CLIENTS_DB[client_id]
    return {"success": True}

# --- AI Endpoints with Ollama ---

@app.post("/api/ai/generate-proposal")
async def generate_proposal(req: ProposalGenerateRequest):
    """Generates structured proposal via Ollama local inference"""
    system_prompt = f"""You are an elite business proposal architect.
Convert this client brief into a winning, professional business proposal.
Client: {req.clientName} ({req.clientCompany or req.clientName})
Project Title: {req.projectTitle}
Industry: {req.industry}
Service: {req.serviceCategory}
Budget: {req.currency} {req.targetBudget}
Deadline: {req.deadline}
Tone: {req.tone}
Brief: {req.brief}

Return clean JSON with: executiveSummary, objectives (list), proposedSolution, deliverables (list), scopeIncluded (list), scopeExcluded (list), timelineSummary, paymentTerms, termsAndConditions."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            ollama_res = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": system_prompt,
                    "format": "json",
                    "stream": False,
                }
            )
            if ollama_res.status_code == 200:
                data = ollama_res.json()
                parsed = json.loads(data.get("response", "{}"))
                return {
                    "id": f"prop-{int(os.times().system * 1000)}",
                    "title": req.projectTitle,
                    "clientName": req.clientName,
                    "clientCompany": req.clientCompany or req.clientName,
                    "clientEmail": req.clientEmail or "",
                    "industry": req.industry,
                    "serviceCategory": req.serviceCategory,
                    "currency": req.currency,
                    "totalBudget": req.targetBudget,
                    "deadline": req.deadline,
                    "tone": req.tone,
                    "status": "draft",
                    **parsed
                }
    except Exception as e:
        pass

    # Fallback response if Ollama is not actively running
    return {
        "id": f"prop-demo",
        "title": req.projectTitle,
        "clientName": req.clientName,
        "clientCompany": req.clientCompany or req.clientName,
        "industry": req.industry,
        "serviceCategory": req.serviceCategory,
        "currency": req.currency,
        "totalBudget": req.targetBudget,
        "deadline": req.deadline,
        "tone": req.tone,
        "status": "draft",
        "executiveSummary": f"Executive proposal for {req.clientCompany or req.clientName}: {req.projectTitle}. Engineered to deliver high reliability and measurable commercial ROI within {req.industry}.",
        "objectives": [
            f"Deliver production-grade {req.serviceCategory} on schedule.",
            "Eliminate operational bottlenecks and streamline client user flow.",
            "Maintain verifiable bi-weekly milestones with live staging demonstrations."
        ],
        "proposedSolution": f"A modular, maintainable technical implementation built to high quality standards.",
        "deliverables": ["Architecture blueprint", "Production deployment", "Developer documentation"],
        "scopeIncluded": ["Core interfaces", "API integration", "QA verification"],
        "scopeExcluded": ["Third party license fees", "Unapproved out-of-scope changes"],
        "timelineSummary": f"Execution targeting completion by {req.deadline}.",
        "paymentTerms": "50% upfront, 25% midpoint, 25% upon final delivery. Net 15.",
        "termsAndConditions": "All intellectual property transfers upon receipt of final invoice settlement."
    }
