from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User, Role
from ...models.job import Job
from ...schemas.job import JobCreate, JobResponse, JobUpdate

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=List[JobResponse])
def get_all_jobs(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all job listings (public endpoint)"""
    query = db.query(Job)
    if active_only:
        query = query.filter(Job.is_active == 1)

    jobs = query.order_by(Job.created_at.desc()).all()

    result = []
    for job in jobs:
        job_dict = {
            "id": job.id,
            "title": job.title,
            "department": job.department,
            "description": job.description,
            "required_skills": json.loads(job.required_skills) if job.required_skills else [],
            "preferred_skills": json.loads(job.preferred_skills) if job.preferred_skills else [],
            "min_experience_years": job.min_experience_years,
            "salary_range": job.salary_range,
            "work_mode": job.work_mode,
            "is_active": job.is_active,
            "created_at": job.created_at
        }
        result.append(JobResponse(**job_dict))

    return result


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a specific job by ID"""
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return JobResponse(
        id=job.id,
        title=job.title,
        department=job.department,
        description=job.description,
        required_skills=json.loads(job.required_skills) if job.required_skills else [],
        preferred_skills=json.loads(job.preferred_skills) if job.preferred_skills else [],
        min_experience_years=job.min_experience_years,
        salary_range=job.salary_range,
        work_mode=job.work_mode,
        is_active=job.is_active,
        created_at=job.created_at
    )


@router.post("", response_model=JobResponse)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job listing (recruiter only)"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can create job listings"
        )

    new_job = Job(
        title=job_data.title,
        department=job_data.department,
        description=job_data.description,
        required_skills=json.dumps(job_data.required_skills),
        preferred_skills=json.dumps(job_data.preferred_skills) if job_data.preferred_skills else None,
        min_experience_years=job_data.min_experience_years,
        salary_range=job_data.salary_range,
        work_mode=job_data.work_mode
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return JobResponse(
        id=new_job.id,
        title=new_job.title,
        department=new_job.department,
        description=new_job.description,
        required_skills=job_data.required_skills,
        preferred_skills=job_data.preferred_skills or [],
        min_experience_years=new_job.min_experience_years,
        salary_range=new_job.salary_range,
        work_mode=new_job.work_mode,
        is_active=new_job.is_active,
        created_at=new_job.created_at
    )


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a job listing (recruiter only)"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can update job listings"
        )

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job_data.title is not None:
        job.title = job_data.title
    if job_data.department is not None:
        job.department = job_data.department
    if job_data.description is not None:
        job.description = job_data.description
    if job_data.required_skills is not None:
        job.required_skills = json.dumps(job_data.required_skills)
    if job_data.preferred_skills is not None:
        job.preferred_skills = json.dumps(job_data.preferred_skills)
    if job_data.min_experience_years is not None:
        job.min_experience_years = job_data.min_experience_years
    if job_data.salary_range is not None:
        job.salary_range = job_data.salary_range
    if job_data.work_mode is not None:
        job.work_mode = job_data.work_mode
    if job_data.is_active is not None:
        job.is_active = job_data.is_active

    db.commit()
    db.refresh(job)

    return JobResponse(
        id=job.id,
        title=job.title,
        department=job.department,
        description=job.description,
        required_skills=json.loads(job.required_skills) if job.required_skills else [],
        preferred_skills=json.loads(job.preferred_skills) if job.preferred_skills else [],
        min_experience_years=job.min_experience_years,
        salary_range=job.salary_range,
        work_mode=job.work_mode,
        is_active=job.is_active,
        created_at=job.created_at
    )


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a job listing (recruiter only)"""
    if current_user.role != Role.RECRUITER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can delete job listings"
        )

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}
