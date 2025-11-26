from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    department: str
    description: str
    required_skills: List[str]
    preferred_skills: Optional[List[str]] = []
    min_experience_years: float = 0
    salary_range: Optional[str] = None
    work_mode: str = "Hybrid"


class JobResponse(BaseModel):
    id: int
    title: str
    department: str
    description: str
    required_skills: List[str]
    preferred_skills: Optional[List[str]] = []
    min_experience_years: float
    salary_range: Optional[str] = None
    work_mode: str
    is_active: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    min_experience_years: Optional[float] = None
    salary_range: Optional[str] = None
    work_mode: Optional[str] = None
    is_active: Optional[int] = None
