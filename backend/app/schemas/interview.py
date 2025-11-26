from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class InterviewCreate(BaseModel):
    position: str
    company: Optional[str] = None


class InterviewResponse(BaseModel):
    id: int
    user_id: int
    position: str
    company: Optional[str] = None
    score: int
    status: str
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewDetailResponse(InterviewResponse):
    conversation: Optional[List[Dict[str, str]]] = None
    assessment: Optional[Dict[str, Any]] = None


class InterviewWithUserResponse(InterviewResponse):
    candidate_name: str
    candidate_email: str


class InterviewMessageRequest(BaseModel):
    message: str


class InterviewMessageResponse(BaseModel):
    interviewer_message: str
    is_complete: bool = False
