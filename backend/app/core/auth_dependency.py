"""
FastAPI Authentication Dependencies.
Derives caller identity strictly from validated server-side session cookies or Bearer tokens.
Never trusts client-supplied user_id.
"""

from datetime import datetime
from typing import Optional
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.session import UserSession


COOKIE_SESSION_NAME = "pitchcraft_session"


def get_session_token_from_request(request: Request) -> Optional[str]:
    """Extract session token from HttpOnly cookie or Authorization Bearer header."""
    token = request.cookies.get(COOKIE_SESSION_NAME)
    if token:
        return token

    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:].strip()

    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """
    Strict authentication dependency.
    Raises 401 Unauthorized if no valid session exists or if session has expired.
    """
    token = get_session_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing session credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Query active session
    session = (
        db.query(UserSession)
        .filter(UserSession.session_token == token)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validate expiration
    if session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_optional_user(
    request: Request,
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Returns authenticated user if present and valid, otherwise None without raising."""
    try:
        return get_current_user(request, db)
    except HTTPException:
        return None
