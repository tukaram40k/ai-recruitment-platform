from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False)  # JSON array
    preferred_skills = Column(Text, nullable=True)  # JSON array
    min_experience_years = Column(Float, default=0)
    salary_range = Column(String(100), nullable=True)
    work_mode = Column(String(50), default="Hybrid")  # Remote, Hybrid, Onsite
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
