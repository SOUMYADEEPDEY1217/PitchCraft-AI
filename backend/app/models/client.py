"""
Client SQLAlchemy 2 database model.
"""

import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Client(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clients"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: f"cli-{uuid.uuid4().hex[:12]}",
        nullable=False,
        index=True,
    )

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    industry = Column(String(128), nullable=False, default="Technology")
    phone = Column(String(64), nullable=True)
    website = Column(String(255), nullable=True)
    status = Column(String(32), nullable=False, default="lead", index=True)
    notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="clients")
    proposals = relationship(
        "Proposal",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Client id='{self.id}' name='{self.name}' company='{self.company}'>"

    @property
    def proposals_count(self) -> int:
        return len(self.proposals) if self.proposals else 0

    @property
    def total_quoted(self) -> float:
        if not self.proposals:
            return 0.0
        total = 0.0
        for p in self.proposals:
            if isinstance(p.pricing_json, dict):
                total += float(p.pricing_json.get("totalBudget") or p.pricing_json.get("total_budget") or 0.0)
        return total

    @property
    def total_paid(self) -> float:
        if not self.proposals:
            return 0.0
        total = 0.0
        for p in self.proposals:
            if p.status == "accepted" and isinstance(p.pricing_json, dict):
                total += float(p.pricing_json.get("totalBudget") or p.pricing_json.get("total_budget") or 0.0)
        return total
