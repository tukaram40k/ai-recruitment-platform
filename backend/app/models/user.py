from sqlalchemy import Column, Integer, String, Text, Enum
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

    interviews = relationship("Interview", back_populates="user")

    @property
    def email_prefix(self) -> str:
        return self.email.split("@")[0] if self.email else ""
