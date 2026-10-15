"""
AI Generation History SQLAlchemy 2 database model.
Tracks LLM inference requests, latency, models, and outcome status.
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import UUIDMixin


class AIGenerationHistory(Base, UUIDMixin):
    __tablename__ = "ai_generation_history"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    proposal_id = Column(
        String(36),
        ForeignKey("proposals.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    model_name = Column(String(64), nullable=False)
    generation_type = Column(String(64), nullable=False, index=True)  # proposal_full, cover_letter, follow_up, section_improve
    duration_ms = Column(Integer, nullable=False, default=0)
    status = Column(String(32), nullable=False, default="success")  # success, failed

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="generation_history")
    proposal = relationship("Proposal", back_populates="generation_history")

    def __repr__(self) -> str:
        return (
            f"<AIGenerationHistory id='{self.id}' type='{self.generation_type}' "
            f"model='{self.model_name}' status='{self.status}'>"
        )
