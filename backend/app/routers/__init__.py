from app.routers.health import router as health_router
from app.routers.clients import router as clients_router
from app.routers.proposals import router as proposals_router
from app.routers.pricing import router as pricing_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ai import router as ai_router

__all__ = [
    "health_router",
    "clients_router",
    "proposals_router",
    "pricing_router",
    "dashboard_router",
    "ai_router",
]
