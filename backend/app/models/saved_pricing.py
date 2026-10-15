"""
Saved Pricing Estimate SQLAlchemy 2 database model.
Associates saved pricing calculations and estimates with authenticated users.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class SavedPricingEstimate(Base):
    __tablename__ = "saved_pricing_estimates"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: f"est-{uuid.uuid4().hex[:12]}",
        nullable=False,
        index=True,
    )

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    client_name = Column(String(255), nullable=True)
    calculation_json = Column(JSON, nullable=False, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="saved_pricing")

    def __repr__(self) -> str:
        return f"<SavedPricingEstimate id='{self.id}' user_id='{self.user_id}' title='{self.title}'>"
