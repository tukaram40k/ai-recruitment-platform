from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User, Role
from ...models.interview import Interview
from ...schemas.interview import InterviewResponse, InterviewWithUserResponse

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.get("/candidates", response_model=List[InterviewWithUserResponse])
def get_scored_candidates(
    min_score: int = Query(default=0, ge=0, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all interviews with score > 0 (candidates who completed interviews)"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )

    interviews = db.query(Interview).join(User).filter(
        Interview.score > min_score
    ).order_by(Interview.score.desc()).all()

    result = []
    for interview in interviews:
        user = db.query(User).filter(User.id == interview.user_id).first()
        result.append(InterviewWithUserResponse(
            id=interview.id,
            user_id=interview.user_id,
            position=interview.position,
            company=interview.company,
            score=interview.score,
            status=interview.status,
            created_at=interview.created_at,
            completed_at=interview.completed_at,
            candidate_name=user.name,
            candidate_email=user.email
        ))

    return result


@router.get("/interviews", response_model=List[InterviewWithUserResponse])
def get_all_interviews(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all interviews for recruiter dashboard"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )

    query = db.query(Interview).join(User)

    if status_filter:
        query = query.filter(Interview.status == status_filter)

    interviews = query.order_by(Interview.created_at.desc()).all()

    result = []
    for interview in interviews:
        user = db.query(User).filter(User.id == interview.user_id).first()
        result.append(InterviewWithUserResponse(
            id=interview.id,
            user_id=interview.user_id,
            position=interview.position,
            company=interview.company,
            score=interview.score,
            status=interview.status,
            created_at=interview.created_at,
            completed_at=interview.completed_at,
            candidate_name=user.name,
            candidate_email=user.email
        ))

    return result


@router.get("/interviews/{interview_id}")
def get_interview_details(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed interview information including conversation and assessment"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )

    interview = db.query(Interview).filter(Interview.id == interview_id).first()

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    user = db.query(User).filter(User.id == interview.user_id).first()

    return {
        "id": interview.id,
        "user_id": interview.user_id,
        "position": interview.position,
        "company": interview.company,
        "score": interview.score,
        "status": interview.status,
        "created_at": interview.created_at,
        "completed_at": interview.completed_at,
        "candidate_name": user.name,
        "candidate_email": user.email,
        "candidate_cv": user.cv,
        "candidate_info": user.info,
        "conversation": interview.conversation,
        "assessment": interview.assessment
    }


@router.get("/stats")
def get_recruiter_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get statistics for recruiter dashboard"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can access this endpoint"
        )

    total_interviews = db.query(Interview).count()
    completed_interviews = db.query(Interview).filter(Interview.status == "completed").count()
    pending_interviews = db.query(Interview).filter(Interview.status == "pending").count()
    high_scorers = db.query(Interview).filter(Interview.score >= 80).count()

    return {
        "total_interviews": total_interviews,
        "completed_interviews": completed_interviews,
        "pending_interviews": pending_interviews,
        "high_scorers": high_scorers
    }
