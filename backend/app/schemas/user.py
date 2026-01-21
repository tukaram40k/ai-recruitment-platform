from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class RoleEnum(str, Enum):
    CANDIDATE = "ROLE_CANDIDATE"
    RECRUITER = "ROLE_RECRUITER"


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.CANDIDATE


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    info: Optional[str] = None
    cv: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    info: Optional[str] = None
    cv: Optional[str] = None
    two_factor_enabled: bool = False
    totp_confirmed: bool = False

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    info: Optional[str] = None
    cv: Optional[str] = None
    two_factor_enabled: bool = False
    totp_confirmed: bool = False

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# 2FA Schemas
class TwoFactorLoginResponse(BaseModel):
    """Response when 2FA is required after initial login."""
    requires_2fa: bool = True
    session_token: str
    email: str
    message: str = "Verification code sent to your email"


class TwoFactorVerifyRequest(BaseModel):
    """Request to verify 2FA code."""
    session_token: str
    code: str


class TwoFactorResendRequest(BaseModel):
    """Request to resend 2FA code."""
    session_token: str


class TwoFactorResendResponse(BaseModel):
    """Response after resending 2FA code."""
    message: str = "Verification code resent to your email"
    email: str


class LoginResponse(BaseModel):
    """
    Unified login response that can either be:
    - A full token response (if 2FA is disabled)
    - A 2FA required response (if 2FA is enabled)
    """
    requires_2fa: Optional[bool] = None
    session_token: Optional[str] = None
    email: Optional[str] = None
    message: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user: Optional[UserResponse] = None


class Toggle2FARequest(BaseModel):
    """Request to enable/disable 2FA."""
    enabled: bool


class Toggle2FAResponse(BaseModel):
    """Response after toggling 2FA."""
    two_factor_enabled: bool
    message: str


# TOTP (Google Authenticator) Schemas
class TOTPSetupResponse(BaseModel):
    """Response with QR code for setting up Google Authenticator."""
    secret: str
    qr_code: str  # Base64 encoded QR code image
    otpauth_url: str


class TOTPVerifyRequest(BaseModel):
    """Request to verify TOTP code during setup or login."""
    code: str


class TOTPLoginRequest(BaseModel):
    """Request to verify TOTP code during login."""
    session_token: str
    code: str
