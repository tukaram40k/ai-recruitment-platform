from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User, Role
from ...models.interview import Interview
from ...models.job import Job
from ...schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewDetailResponse,
    InterviewMessageRequest,
    InterviewMessageResponse
)
from ...services.ai_service import (
    get_ai_service,
    get_interview_session,
    remove_interview_session
)

router = APIRouter(prefix="/interview", tags=["Interview"])


@router.post("/start/{interview_id}")
def start_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start an AI interview session"""
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can take interviews"
        )

    # Get interview
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This interview has already been completed"
        )

    # Initialize interview session
    session = get_interview_session(interview_id)
    session.initialize(
        candidate_cv=current_user.cv or f"Candidate: {current_user.name}\nEmail: {current_user.email}",
        job_position=interview.position,
        job_description=f"Interview for {interview.position} position at {interview.company or 'our company'}"
    )

    # Update interview status
    interview.status = "in_progress"
    db.commit()

    # Get first interviewer message
    result = session.get_next_message()

    return {
        "interview_id": interview_id,
        "status": "in_progress",
        "interviewer_message": result["message"],
        "is_complete": result["is_complete"]
    }


@router.post("/message/{interview_id}", response_model=InterviewMessageResponse)
def send_message(
    interview_id: int,
    message: InterviewMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message in the interview and get AI response"""
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can participate in interviews"
        )

    # Get interview
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This interview has already been completed"
        )

    # Get session and process message
    session = get_interview_session(interview_id)
    result = session.get_next_message(message.message)

    # If interview is complete, generate assessment and save
    if result["is_complete"]:
        assessment = session.generate_assessment()
        conversation = session.get_conversation_history()

        interview.status = "completed"
        interview.score = assessment.get("overall_score", 0)
        interview.conversation = json.dumps(conversation)
        interview.assessment = json.dumps(assessment)
        interview.completed_at = datetime.utcnow()
        db.commit()

        # Clean up session
        remove_interview_session(interview_id)

    return InterviewMessageResponse(
        interviewer_message=result["message"],
        is_complete=result["is_complete"]
    )


@router.get("/result/{interview_id}")
def get_interview_result(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the result of a completed interview"""
    # Candidates can only see their own, recruiters can see all
    if current_user.role == Role.CANDIDATE.value:
        interview = db.query(Interview).filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id
        ).first()
    else:
        interview = db.query(Interview).filter(
            Interview.id == interview_id
        ).first()

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    if interview.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview has not been completed yet"
        )

    conversation = json.loads(interview.conversation) if interview.conversation else []
    assessment = json.loads(interview.assessment) if interview.assessment else {}

    return {
        "interview_id": interview.id,
        "position": interview.position,
        "company": interview.company,
        "score": interview.score,
        "status": interview.status,
        "completed_at": interview.completed_at,
        "conversation": conversation,
        "assessment": assessment
    }


@router.post("/upload-cv")
async def upload_cv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and parse a CV file"""
    if current_user.role != Role.CANDIDATE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload CVs"
        )

    # Validate file type
    allowed_extensions = ['.pdf', '.docx', '.doc', '.txt']
    file_ext = '.' + file.filename.split('.')[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        # Read file content
        content = await file.read()

        # Parse CV using AI service
        ai_service = get_ai_service()
        cv_text = ai_service.read_cv(content, file.filename)
        profile = ai_service.extract_profile(cv_text)

        # Update user profile with CV data
        current_user.cv = cv_text
        current_user.info = json.dumps({
            "skills": profile.skills,
            "experience_years": profile.years_of_experience,
            "current_position": profile.current_position,
            "education": profile.education,
            "work_history": profile.work_history
        })
        db.commit()

        return {
            "message": "CV uploaded and parsed successfully",
            "profile": {
                "name": profile.name,
                "current_position": profile.current_position,
                "years_of_experience": profile.years_of_experience,
                "skills": profile.skills[:10],  # Return top 10 skills
                "education_count": len(profile.education),
                "work_history_count": len(profile.work_history)
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing CV: {str(e)}"
        )
