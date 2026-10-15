"""
System health and AI engine connectivity status routers.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings
from app.services.ollama_service import ollama_service
from app.schemas.ai import AiHealthResponse

router = APIRouter(tags=["Health & Diagnostics"])


@router.get("/health", status_code=status.HTTP_200_OK)
def get_system_health(db: Session = Depends(get_db)):
    """
    Checks backend system health, database accessibility, and environment mode.
    """
    db_healthy = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_healthy = False

    return {
        "status": "healthy" if db_healthy else "degraded",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database_connected": db_healthy,
        "single_user_mode": settings.SINGLE_USER_MODE,
    }


@router.get("/ai/health", response_model=AiHealthResponse, status_code=status.HTTP_200_OK)
async def get_ai_engine_health():
    """
    Pings the configured Ollama inference server and returns model availability and latency.
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
