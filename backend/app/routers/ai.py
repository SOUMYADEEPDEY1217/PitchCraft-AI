"""
AI Tools router for Ollama local inference with multi-tenant user history.
Implements:
1. Health and Model Management (list models, switch model)
2. Client Brief Analyzer (8-dimensional extraction)
3. Cover Letter Generator (never invents credentials)
4. Follow-Up Email Sequence Generator
5. Proposal Improvement Assistant (strategic section polishing)
6. Selective Section Regeneration
7. User-isolated generation history audit
"""

import time
from typing import Optional, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.generation_history import AIGenerationHistory
from app.core.auth_dependency import get_optional_user, get_current_user
from app.schemas.ai import (
    AiHealthResponse,
    ModelSwitchRequest,
    ModelListResponse,
    ClientBriefAnalysisRequest,
    ClientBriefAnalysisResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    FollowUpRequest,
    FollowUpResponse,
    ProposalImprovementRequest,
    ProposalImprovementResponse,
    SectionRegenerateRequest,
    SectionRegenerateResponse,
)
from app.services.ollama_service import ollama_service
from app.core.logging import logger


class AiHistoryItemResponse(BaseModel):
    id: str
    generationType: str
    modelName: str
    durationMs: int
    status: str
    createdAt: str


router = APIRouter(prefix="/ai", tags=["AI Engine & Local Ollama"])


@router.get("/health", response_model=AiHealthResponse, status_code=status.HTTP_200_OK)
async def get_ai_engine_health():
    """
    Pings Ollama server, checks connectivity, latency, and model availability.
    """
    health_info = await ollama_service.check_health()
    return AiHealthResponse(
        is_connected=health_info["is_connected"],
        service=health_info["service"],
        model=health_info["model"],
        available_models=health_info["available_models"],
        latency_ms=health_info.get("latency_ms"),
        message=health_info.get("message"),
    )


@router.get("/models", response_model=ModelListResponse, status_code=status.HTTP_200_OK)
async def list_available_models():
    """
    Lists available local models pulled in Ollama and reports the current active model.
    """
    models = await ollama_service.get_available_models()
    return ModelListResponse(
        active_model=ollama_service.model,
        available_models=models,
        is_connected=len(models) > 0,
    )


@router.post("/switch-model", response_model=ModelListResponse, status_code=status.HTTP_200_OK)
async def switch_model(req: ModelSwitchRequest):
    """
    Dynamically switches active Ollama model at runtime.
    """
    success = await ollama_service.set_model(req.model)
    models = await ollama_service.get_available_models()
    return ModelListResponse(
        active_model=ollama_service.model,
        available_models=models,
        is_connected=success,
    )


@router.post("/analyze-brief", response_model=ClientBriefAnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_brief(
    req: ClientBriefAnalysisRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Client Brief Analyzer: Extracts 8 critical dimensions from briefs.
    """
    start_time = time.time()
    result = await ollama_service.analyze_client_brief(req)
    duration_ms = int((time.time() - start_time) * 1000)

    try:
        history = AIGenerationHistory(
            user_id=current_user.id if current_user else None,
            proposal_id=None,
            model_name=result.model_used,
            generation_type="brief_analysis",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()
    except Exception as exc:
        logger.warning(f"Could not log AI history: {exc}")
        db.rollback()

    return result


@router.post("/cover-letter", response_model=CoverLetterResponse, status_code=status.HTTP_200_OK)
async def generate_cover_letter(
    req: CoverLetterRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Generates proposal cover letter without inventing credentials.
    """
    start_time = time.time()
    letter_text = await ollama_service.generate_cover_letter(req)
    duration_ms = int((time.time() - start_time) * 1000)

    try:
        history = AIGenerationHistory(
            user_id=current_user.id if current_user else None,
            proposal_id=None,
            model_name=req.model or ollama_service.model,
            generation_type="cover_letter",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()
    except Exception as exc:
        logger.warning(f"Could not log AI history: {exc}")
        db.rollback()

    actual_text = letter_text.cover_letter if hasattr(letter_text, "cover_letter") else str(letter_text)
    return CoverLetterResponse(
        cover_letter=actual_text,
        model_used=req.model or ollama_service.model,
    )


@router.post("/follow-up", response_model=FollowUpResponse, status_code=status.HTTP_200_OK)
async def generate_follow_up(
    req: FollowUpRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Generates multi-stage follow-up email sequences for sent proposals.
    """
    start_time = time.time()
    data = await ollama_service.generate_follow_up(req)
    duration_ms = int((time.time() - start_time) * 1000)

    try:
        history = AIGenerationHistory(
            user_id=current_user.id if current_user else None,
            proposal_id=None,
            model_name=req.model or ollama_service.model,
            generation_type="follow_up",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()
    except Exception as exc:
        logger.warning(f"Could not log AI history: {exc}")
        db.rollback()

    if isinstance(data, FollowUpResponse):
        return data

    subject = getattr(data, "subject", None) or (data["subject"] if isinstance(data, dict) else "")
    body = getattr(data, "body", None) or (data["body"] if isinstance(data, dict) else "")
    stage = getattr(data, "stage", None) or (data.get("stage") if isinstance(data, dict) else req.stage)
    model_used = getattr(data, "model_used", None) or (data.get("model_used") if isinstance(data, dict) else (req.model or ollama_service.model))

    return FollowUpResponse(
        subject=subject,
        body=body,
        stage=stage,
        model_used=model_used,
    )


@router.post("/improve-section", response_model=ProposalImprovementResponse, status_code=status.HTTP_200_OK)
async def improve_section(
    req: ProposalImprovementRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Polishes an existing section with evaluation metrics.
    """
    start_time = time.time()
    result = await ollama_service.improve_proposal_section(req)
    duration_ms = int((time.time() - start_time) * 1000)

    try:
        history = AIGenerationHistory(
            user_id=current_user.id if current_user else None,
            proposal_id=None,
            model_name=result.model_used,
            generation_type="section_improvement",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()
    except Exception as exc:
        logger.warning(f"Could not log AI history: {exc}")
        db.rollback()

    return result


@router.post("/regenerate-section", response_model=SectionRegenerateResponse, status_code=status.HTTP_200_OK)
async def regenerate_section(
    req: SectionRegenerateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Selective Section Regeneration.
    """
    start_time = time.time()
    result = await ollama_service.regenerate_section(req)
    duration_ms = int((time.time() - start_time) * 1000)

    try:
        history = AIGenerationHistory(
            user_id=current_user.id if current_user else None,
            proposal_id=req.proposal_id,
            model_name=result.model_used,
            generation_type="selective_regeneration",
            duration_ms=duration_ms,
            status="success",
        )
        db.add(history)
        db.commit()
    except Exception as exc:
        logger.warning(f"Could not log AI history: {exc}")
        db.rollback()

    return result


@router.get("/history", response_model=List[AiHistoryItemResponse], status_code=status.HTTP_200_OK)
def get_ai_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Lists AI generation requests performed by the authenticated user.
    """
    records = (
        db.query(AIGenerationHistory)
        .filter(AIGenerationHistory.user_id == current_user.id)
        .order_by(AIGenerationHistory.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        AiHistoryItemResponse(
            id=r.id,
            generationType=r.generation_type,
            modelName=r.model_name,
            durationMs=r.duration_ms,
            status=r.status,
            createdAt=r.created_at.isoformat() if r.created_at else "",
        )
        for r in records
    ]
