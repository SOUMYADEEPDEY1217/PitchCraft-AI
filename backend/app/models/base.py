"""
Base model classes and mixins for SQLAlchemy 2 models.
Supports both SQLite and PostgreSQL.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.database import Base


class UUIDMixin:
    """Provides a UUID string primary key compatible with SQLite and PostgreSQL."""
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        nullable=False,
        index=True,
    )


class TimestampMixin:
    """Provides created_at and updated_at datetime tracking."""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
