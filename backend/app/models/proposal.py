"""
Proposal SQLAlchemy 2 database model.
"""

import uuid
from sqlalchemy import Column, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Proposal(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "proposals"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: f"prop-{uuid.uuid4().hex[:12]}",
        nullable=False,
        index=True,
    )

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    client_id = Column(
        String(36),
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    project_title = Column(String(255), nullable=False, index=True)
    project_brief = Column(Text, nullable=False, default="")
    service_category = Column(String(64), nullable=False, default="web_development", index=True)
    tone = Column(String(32), nullable=False, default="consultative")
    currency = Column(String(16), nullable=False, default="USD")

    # Structured Proposal Document Body (executiveSummary, objectives, deliverables, milestones, etc.)
    content_json = Column(JSON, nullable=False, default=dict)

    # Structured Pricing Breakdown (items, rate, totalBudget, paymentTerms, deposit, etc.)
    pricing_json = Column(JSON, nullable=False, default=dict)

    # Workflow state: draft, sent, accepted, rejected (or in_review)
    status = Column(String(32), nullable=False, default="draft", index=True)

    # Relationships
    user = relationship("User", back_populates="proposals")
    client = relationship("Client", back_populates="proposals")
    generation_history = relationship(
        "AIGenerationHistory",
        back_populates="proposal",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @property
    def title(self) -> str:
        return self.project_title

    @property
    def brief(self) -> str:
        return self.project_brief

    def __repr__(self) -> str:
        return f"<Proposal id='{self.id}' title='{self.project_title}' status='{self.status}'>"
