from sqlalchemy import Column, Integer, String, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class Role(str, enum.Enum):
    CANDIDATE = "ROLE_CANDIDATE"
    RECRUITER = "ROLE_RECRUITER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=Role.CANDIDATE.value)
    info = Column(Text, nullable=True)
    cv = Column(Text, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)  # 2FA disabled by default
    totp_secret = Column(String(32), nullable=True)  # Secret for Google Authenticator
    totp_confirmed = Column(Boolean, default=False)  # Whether TOTP is set up and confirmed

    interviews = relationship("Interview", back_populates="user")
    two_factor_codes = relationship("TwoFactorCode", back_populates="user", cascade="all, delete-orphan")
    two_factor_sessions = relationship("TwoFactorSession", back_populates="user", cascade="all, delete-orphan")

    @property
    def email_prefix(self) -> str:
        return self.email.split("@")[0] if self.email else ""
