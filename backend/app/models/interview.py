from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    position = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    score = Column(Integer, default=0, index=True)
    status = Column(String(50), default="pending")  # pending, in_progress, completed
    conversation = Column(Text, nullable=True)  # JSON string of conversation history
    assessment = Column(Text, nullable=True)  # JSON string of AI assessment
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="interviews")
