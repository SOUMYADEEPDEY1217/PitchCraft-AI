"""
PitchCraft AI — FastAPI Main Application Entrypoint.
Initializes middleware, routers, exception handlers, and database lifecycle.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.client import Client
from app.models.proposal import Proposal
from app.core.logging import logger
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)

# Import Routers
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.clients import router as clients_router
from app.routers.proposals import router as proposals_router
from app.routers.pricing import router as pricing_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ai import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle management.
    Ensures persistent database schema is initialized without wiping user data.
    """
    logger.info("Initializing PitchCraft AI database tables (persistence mode enabled)...")
    Base.metadata.create_all(bind=engine)
    logger.info(f"PitchCraft AI Backend running in {settings.ENVIRONMENT} mode.")
    yield
    logger.info("PitchCraft AI Backend shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Production-ready FastAPI backend for PitchCraft AI. "
        "Provides proposal lifecycle management, client CRM, pricing calculations, "
        "local Ollama AI inference, and ReportLab PDF document exports."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Mount API Routers
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(clients_router, prefix=settings.API_PREFIX)
app.include_router(proposals_router, prefix=settings.API_PREFIX)
app.include_router(pricing_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(ai_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Root"])
def root_endpoint():
    """Service metadata and links to interactive OpenAPI documentation."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": f"{settings.API_PREFIX}/health",
        "ai_health_check": f"{settings.API_PREFIX}/ai/health",
        "single_user_mode": settings.SINGLE_USER_MODE,
    }
