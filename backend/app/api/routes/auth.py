import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.config import settings
from ...core.security import get_password_hash, verify_password, create_access_token, get_current_user
from ...models.user import User
from ...models.two_factor import TwoFactorCode, TwoFactorSession
from ...schemas.user import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    TwoFactorLoginResponse, TwoFactorVerifyRequest, TwoFactorResendRequest,
    TwoFactorResendResponse, LoginResponse, Toggle2FARequest, Toggle2FAResponse,
    TOTPSetupResponse, TOTPVerifyRequest, TOTPLoginRequest
)
from ...services.totp_service import setup_totp, verify_totp

router = APIRouter(prefix="/auth", tags=["Authentication"])


def create_2fa_session(db: Session, user: User) -> str:
    """Create a new 2FA session and return the session token."""
    # Clean up old sessions for this user
    db.query(TwoFactorSession).filter(
        TwoFactorSession.user_id == user.id
    ).delete()
    
    # Create new session
    session_token = secrets.token_urlsafe(32)
    session = TwoFactorSession(
        session_token=session_token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    )
    db.add(session)
    db.commit()
    
    return session_token
    
    return otp_code


@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role.value,
        two_factor_enabled=False  # 2FA disabled by default, user sets it up manually
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate token (no 2FA on registration - user just created account)
    access_token = create_access_token(data={"sub": new_user.email})

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(new_user)
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    credentials: UserLogin,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if 2FA is enabled for user (must also have TOTP confirmed)
    if user.two_factor_enabled and user.totp_confirmed:
        # Create 2FA session
        session_token = create_2fa_session(db, user)
        
        return LoginResponse(
            requires_2fa=True,
            session_token=session_token,
            email=user.email,
            message="Enter the code from your authenticator app"
        )

    # If 2FA disabled, return token directly
    access_token = create_access_token(data={"sub": user.email})

    return LoginResponse(
        requires_2fa=False,
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/verify-2fa", response_model=TokenResponse)
async def verify_2fa(
    verify_data: TOTPLoginRequest,
    db: Session = Depends(get_db)
):
    """Verify TOTP code and complete login."""
    # Find session
    session = db.query(TwoFactorSession).filter(
        TwoFactorSession.session_token == verify_data.session_token,
        TwoFactorSession.is_verified == False
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired session"
        )
    
    if session.is_expired():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session expired. Please login again."
        )
    
    # Get user
    user = db.query(User).filter(User.id == session.user_id).first()
    
    # Verify TOTP code
    if not verify_totp(user.totp_secret, verify_data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Mark session as verified
    session.is_verified = True
    db.commit()
    
    # Generate access token
    access_token = create_access_token(data={"sub": user.email})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/setup-totp", response_model=TOTPSetupResponse)
async def setup_totp_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate QR code for setting up Google Authenticator."""
    # Generate new TOTP secret
    secret, qr_code, uri = setup_totp(current_user.email)
    
    # Save secret (not confirmed yet)
    current_user.totp_secret = secret
    current_user.totp_confirmed = False
    db.commit()
    
    return TOTPSetupResponse(
        secret=secret,
        qr_code=qr_code,
        otpauth_url=uri
    )


@router.post("/confirm-totp", response_model=Toggle2FAResponse)
async def confirm_totp(
    verify_data: TOTPVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Confirm TOTP setup by verifying first code from authenticator app."""
    if not current_user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please set up TOTP first"
        )
    
    # Verify the code
    if not verify_totp(current_user.totp_secret, verify_data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid code. Please try again."
        )
    
    # Enable 2FA
    current_user.totp_confirmed = True
    current_user.two_factor_enabled = True
    db.commit()
    
    return Toggle2FAResponse(
        two_factor_enabled=True,
        message="Two-factor authentication enabled successfully"
    )


@router.post("/disable-totp", response_model=Toggle2FAResponse)
async def disable_totp(
    verify_data: TOTPVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Disable TOTP (requires current code for security)."""
    if not current_user.totp_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP is not enabled"
        )
    
    # Verify the code before disabling
    if not verify_totp(current_user.totp_secret, verify_data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid code"
        )
    
    # Disable 2FA
    current_user.totp_secret = None
    current_user.totp_confirmed = False
    current_user.two_factor_enabled = False
    db.commit()
    
    return Toggle2FAResponse(
        two_factor_enabled=False,
        message="Two-factor authentication disabled"
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UserResponse.model_validate(current_user)
