from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User, Role
from ...models.interview import Interview
from ...schemas.user import UserResponse, UserUpdate, UserProfileResponse
from ...schemas.interview import InterviewCreate, InterviewResponse

router = APIRouter(prefix="/candidate", tags=["Candidate"])


@router.get("/profile", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )
    return current_user


@router.put("/profile", response_model=UserProfileResponse)
def update_my_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )

    if update_data.name is not None:
        current_user.name = update_data.name
    if update_data.info is not None:
        current_user.info = update_data.info
    if update_data.cv is not None:
        current_user.cv = update_data.cv

    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/profile/cv", response_model=UserProfileResponse)
def update_cv(
    cv_content: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )

    current_user.cv = cv_content
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/interviews", response_model=List[InterviewResponse])
def get_my_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )

    interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).order_by(Interview.created_at.desc()).all()

    return interviews


@router.post("/interviews", response_model=InterviewResponse)
def create_interview(
    interview_data: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )

    new_interview = Interview(
        user_id=current_user.id,
        position=interview_data.position,
        company=interview_data.company,
        status="pending"
    )
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)

    return new_interview


@router.get("/interviews/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )

    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    return interview
