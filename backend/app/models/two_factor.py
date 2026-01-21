from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class TwoFactorCode(Base):
    """Model for storing 2FA verification codes."""
    __tablename__ = "two_factor_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    
    # Relationship to user
    user = relationship("User", back_populates="two_factor_codes")

    def is_expired(self) -> bool:
        """Check if the OTP code has expired."""
        return datetime.utcnow() > self.expires_at

    def is_valid(self) -> bool:
        """Check if the OTP code is valid (not expired and not used)."""
        return not self.is_expired() and not self.is_used


class TwoFactorSession(Base):
    """
    Temporary session for 2FA verification.
    Stores user info between initial login and OTP verification.
    """
    __tablename__ = "two_factor_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_verified = Column(Boolean, default=False)
    
    # Relationship to user
    user = relationship("User", back_populates="two_factor_sessions")

    def is_expired(self) -> bool:
        """Check if the session has expired."""
        return datetime.utcnow() > self.expires_at
