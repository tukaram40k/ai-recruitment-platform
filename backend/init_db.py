"""
Database initialization script.
Run this to create tables and seed initial data.
"""
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.interview import Interview
from app.models.job import Job
import json


def init_db():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def seed_data():
    """Seed initial data"""
    db = SessionLocal()

    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping seed.")
            return

        print("Seeding initial data...")

        # Create sample users
        users = [
            # Candidates
            User(
                name="John Doe",
                email="john.doe@email.com",
                password=get_password_hash("password123"),
                role=Role.CANDIDATE.value,
                info=json.dumps({"skills": ["Python", "React", "SQL"], "experience_years": 3}),
                cv="Experienced software developer with 3 years of experience..."
            ),
            User(
                name="Jane Smith",
                email="jane.smith@email.com",
                password=get_password_hash("password123"),
                role=Role.CANDIDATE.value,
                info=json.dumps({"skills": ["Java", "Spring", "AWS"], "experience_years": 5}),
                cv="Senior backend developer specializing in Java..."
            ),
            User(
                name="Mike Johnson",
                email="mike.johnson@email.com",
                password=get_password_hash("password123"),
                role=Role.CANDIDATE.value,
                info=json.dumps({"skills": ["JavaScript", "Node.js", "MongoDB"], "experience_years": 2}),
                cv="Full-stack developer with passion for web technologies..."
            ),
            # Recruiters
            User(
                name="Sarah HR",
                email="sarah@company.com",
                password=get_password_hash("password123"),
                role=Role.RECRUITER.value,
                info=json.dumps({"company": "TechCorp", "department": "HR"})
            ),
            User(
                name="Tom Recruiter",
                email="tom@company.com",
                password=get_password_hash("password123"),
                role=Role.RECRUITER.value,
                info=json.dumps({"company": "StartupXYZ", "department": "Talent Acquisition"})
            ),
        ]

        for user in users:
            db.add(user)

        db.commit()

        # Get user IDs for interviews
        john = db.query(User).filter(User.email == "john.doe@email.com").first()
        jane = db.query(User).filter(User.email == "jane.smith@email.com").first()

        # Create sample interviews
        interviews = [
            Interview(
                user_id=john.id,
                position="Senior Software Engineer",
                company="Google",
                score=85,
                status="completed"
            ),
            Interview(
                user_id=john.id,
                position="Full Stack Developer",
                company="Amazon",
                score=0,
                status="pending"
            ),
            Interview(
                user_id=jane.id,
                position="Backend Developer",
                company="Microsoft",
                score=92,
                status="completed"
            ),
        ]

        for interview in interviews:
            db.add(interview)

        # Create sample jobs
        jobs = [
            Job(
                title="Senior Software Engineer",
                department="Engineering",
                description="Looking for an experienced software engineer to lead technical projects.",
                required_skills=json.dumps(["Python", "AWS", "System Design"]),
                preferred_skills=json.dumps(["Kubernetes", "Terraform"]),
                min_experience_years=5,
                salary_range="$150k-$200k",
                work_mode="Hybrid"
            ),
            Job(
                title="Full Stack Developer",
                department="Product",
                description="Join our product team to build amazing user experiences.",
                required_skills=json.dumps(["React", "Node.js", "PostgreSQL"]),
                preferred_skills=json.dumps(["TypeScript", "GraphQL"]),
                min_experience_years=3,
                salary_range="$100k-$140k",
                work_mode="Remote"
            ),
        ]

        for job in jobs:
            db.add(job)

        db.commit()
        print("Sample data seeded successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_data()
