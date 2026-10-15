"""
Authentication Pydantic schemas for signup, login, session validation, and password reset.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class UserSignUpRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255, description="User's full legal or professional name")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=8, max_length=128, description="Strong password (min 8 chars)")
    confirm_password: str = Field(..., description="Confirm matching password")

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

    model_config = ConfigDict(populate_by_name=True)


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")
    remember_me: Optional[bool] = Field(default=True, description="Extend session duration")

    model_config = ConfigDict(populate_by_name=True)


class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str
    isActive: bool
    createdAt: datetime
    updatedAt: datetime
    preferences: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(populate_by_name=True)


class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    agency_name: Optional[str] = None
    hourly_rate: Optional[float] = None
    currency: Optional[str] = None
    bio: Optional[str] = None
    payment_terms: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Account email to dispatch reset token")

    model_config = ConfigDict(populate_by_name=True)


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=16, description="Single-use password reset token")
    new_password: str = Field(..., min_length=8, max_length=128, description="New secure password")
    confirm_password: str = Field(..., description="Confirm matching new password")

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v

    model_config = ConfigDict(populate_by_name=True)


class AuthStatusResponse(BaseModel):
    authenticated: bool
    user: Optional[UserResponse] = None
    message: Optional[str] = None


class MessageResponse(BaseModel):
    success: bool = True
    message: str
