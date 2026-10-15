"""
Authentication router: Signup, Login, Logout, Session Inspection (/me),
User Profile updates, Forgot Password, and Single-Use Password Reset.
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.session import UserSession
from app.models.password_reset import PasswordResetToken
from app.models.user_preferences import UserPreferences
from app.schemas.auth import (
    UserSignUpRequest,
    UserLoginRequest,
    UserResponse,
    UserProfileUpdateRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)
from app.core.security import (
    hash_password,
    verify_password,
    generate_session_token,
    generate_reset_token,
    hash_token,
    RateLimiter,
)
from app.core.auth_dependency import (
    get_current_user,
    get_session_token_from_request,
    COOKIE_SESSION_NAME,
)
from app.core.logging import logger
from app.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication & User Accounts"])

SESSION_MAX_AGE_DAYS = 30
SESSION_SHORT_AGE_HOURS = 24
RESET_TOKEN_EXPIRY_MINUTES = 60


def set_session_cookie(response: Response, token: str, max_age_seconds: int):
    """Sets secure HttpOnly cookie for session token."""
    is_production = settings.ENVIRONMENT.lower() == "production"
    response.set_cookie(
        key=COOKIE_SESSION_NAME,
        value=token,
        max_age=max_age_seconds,
        httponly=True,
        secure=is_production,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response):
    """Clears the session cookie."""
    response.delete_cookie(
        key=COOKIE_SESSION_NAME,
        path="/",
        httponly=True,
        samesite="lax",
    )


def user_to_response(user: User, db: Session) -> UserResponse:
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    return UserResponse(
        id=user.id,
        fullName=user.full_name,
        email=user.email,
        isActive=user.is_active,
        createdAt=user.created_at,
        updatedAt=user.updated_at,
        preferences=pref.settings_json if pref else {},
    )


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(req: UserSignUpRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Registers a new user account with unique email and hashed password.
    Creates an active server session and sets HttpOnly cookie.
    All new users start with 0 proposals, 0 clients, and clean empty state.
    """
    client_ip = request.client.host if request.client else "unknown"
    if RateLimiter.is_rate_limited(f"signup:{client_ip}", max_attempts=10, window_seconds=900):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Please try again later.",
        )

    # Check unique email
    existing_user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Hash password with PBKDF2-SHA256 (600,000 iterations)
    p_hash = hash_password(req.password)

    new_user = User(
        full_name=req.full_name.strip(),
        email=req.email.lower().strip(),
        password_hash=p_hash,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default user preferences
    initial_pref = UserPreferences(
        user_id=new_user.id,
        settings_json={
            "freelancerName": new_user.full_name,
            "freelancerEmail": new_user.email,
            "agencyName": "Independent Studio",
            "defaultHourlyRate": 75,
            "defaultCurrency": "INR",
        },
    )
    db.add(initial_pref)

    # Generate session token
    token = generate_session_token()
    max_age_days = SESSION_MAX_AGE_DAYS
    expires_at = datetime.utcnow() + timedelta(days=max_age_days)

    session_record = UserSession(
        session_token=token,
        user_id=new_user.id,
        expires_at=expires_at,
        user_agent=request.headers.get("User-Agent"),
        ip_address=client_ip,
    )
    db.add(session_record)
    db.commit()

    set_session_cookie(response, token, max_age_seconds=max_age_days * 86400)
    logger.info(f"User registered successfully: {new_user.email} (ID: {new_user.id})")

    return user_to_response(new_user, db)


@router.post("/login", response_model=UserResponse, status_code=status.HTTP_200_OK)
def login(req: UserLoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Authenticates user credentials with rate limiting and constant-time password verification.
    Sets secure HttpOnly session cookie.
    """
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"login:{client_ip}:{req.email.lower().strip()}"

    if RateLimiter.is_rate_limited(rate_key, max_attempts=5, window_seconds=900):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 15 minutes before trying again.",
        )

    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support.",
        )

    # Reset rate limit on successful credentials
    RateLimiter.reset(rate_key)

    token = generate_session_token()
    days = SESSION_MAX_AGE_DAYS if req.remember_me else 1
    expires_at = datetime.utcnow() + timedelta(days=days)

    session_record = UserSession(
        session_token=token,
        user_id=user.id,
        expires_at=expires_at,
        user_agent=request.headers.get("User-Agent"),
        ip_address=client_ip,
    )
    db.add(session_record)
    db.commit()

    set_session_cookie(response, token, max_age_seconds=days * 86400)
    logger.info(f"User logged in: {user.email}")

    return user_to_response(user, db)


@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Terminates active session, removes session record from database,
    and clears HttpOnly cookie.
    """
    token = get_session_token_from_request(request)
    if token:
        db.query(UserSession).filter(UserSession.session_token == token).delete()
        db.commit()

    clear_session_cookie(response)
    return MessageResponse(success=True, message="Successfully logged out.")


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns profile information of authenticated caller derived strictly from server session.
    """
    return user_to_response(current_user, db)


@router.put("/profile", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user_profile(
    req: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Updates the authenticated user's profile and studio preferences.
    """
    if req.full_name:
        current_user.full_name = req.full_name.strip()
        current_user.updated_at = datetime.utcnow()

    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not pref:
        pref = UserPreferences(user_id=current_user.id, settings_json={})
        db.add(pref)

    data = pref.settings_json.copy() if pref.settings_json else {}
    if req.agency_name is not None:
        data["agencyName"] = req.agency_name
    if req.hourly_rate is not None:
        data["defaultHourlyRate"] = req.hourly_rate
    if req.currency is not None:
        data["defaultCurrency"] = req.currency
    if req.bio is not None:
        data["bio"] = req.bio
    if req.payment_terms is not None:
        data["defaultPaymentTerms"] = req.payment_terms

    pref.settings_json = data
    pref.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(current_user)

    return user_to_response(current_user, db)


@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def forgot_password(req: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    """
    Initiates single-use password reset flow with expiring cryptographic token.
    Generic response prevents user enumeration.
    """
    client_ip = request.client.host if request.client else "unknown"
    if RateLimiter.is_rate_limited(f"forgot:{client_ip}", max_attempts=3, window_seconds=900):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many password reset requests. Please wait before trying again.",
        )

    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if user:
        raw_token, t_hash = generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)

        reset_record = PasswordResetToken(
            token_hash=t_hash,
            user_id=user.id,
            expires_at=expires_at,
        )
        db.add(reset_record)
        db.commit()
        # In production, dispatch email; in local dev log audit trail safely
        logger.info(f"Password reset token generated for user ID {user.id} (expires in {RESET_TOKEN_EXPIRY_MINUTES}m)")

    return MessageResponse(
        success=True,
        message="If an account exists with this email address, password reset instructions have been dispatched.",
    )


@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def reset_password(req: ResetPasswordRequest, request: Request, db: Session = Depends(get_db)):
    """
    Validates single-use token and resets the user's password.
    Invalidates all active sessions for security.
    """
    client_ip = request.client.host if request.client else "unknown"
    if RateLimiter.is_rate_limited(f"reset:{client_ip}", max_attempts=5, window_seconds=900):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many reset attempts. Please request a new link.",
        )

    t_hash = hash_token(req.token.strip())
    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == t_hash,
            PasswordResetToken.used_at.is_(None),
        )
        .first()
    )

    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or previously used password reset link. Please request a new one.",
        )

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this token could not be found.",
        )

    # Update password and mark token used
    user.password_hash = hash_password(req.new_password)
    user.updated_at = datetime.utcnow()
    record.used_at = datetime.utcnow()

    # Terminate all existing sessions for security
    db.query(UserSession).filter(UserSession.user_id == user.id).delete()
    db.commit()

    logger.info(f"Password reset successfully for user ID {user.id}")

    return MessageResponse(
        success=True,
        message="Your password has been successfully reset. Please log in with your new credentials.",
    )
