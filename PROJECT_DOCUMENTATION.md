# AI Recruitment Platform - Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Security Features](#6-security-features)
7. [Application Features](#7-application-features)
8. [File Structure](#8-file-structure)
9. [Deployment](#9-deployment)
10. [Environment Variables](#10-environment-variables)
11. [Development Guide](#11-development-guide)

---

## 1. Project Overview

### 1.1 What is the AI Recruitment Platform?

The **AI Recruitment Platform** is an intelligent automated recruitment system that streamlines hiring processes by combining AI-driven CV analysis with dynamic AI-powered interviews. It replaces traditional manual CV screening with a multi-agent AI pipeline.

### 1.2 Problem Statement

Traditional IT recruitment suffers from several challenges:
- Slow, manual CV screening process
- Human bias and fatigue leading to inconsistent evaluations
- High operational burden on HR and hiring managers
- Significantly increased Time-to-Hire (TTH)
- Lack of data-driven decision-making

### 1.3 Solution

The platform automates five key stages of recruitment:

| Stage | Description |
|-------|-------------|
| **CV Upload & Storage** | Secure document management |
| **CV Parsing** | AI extracts education, skills, experience |
| **Candidate Profiling** | Role-based matching against job requirements |
| **Dynamic AI Interview** | LLM-driven personalized Q&A based on CV |
| **Scoring & Recommendation** | Objective scoring with justification |

### 1.4 Key Benefits

- Reduces Time-to-Hire dramatically
- Eliminates early-stage interviews for unfit candidates
- Provides audit-ready transparent evaluations
- Mitigates unconscious bias through standardized evaluation
- GDPR-compliant data handling

### 1.5 Target Users

| Persona | Role | Needs |
|---------|------|-------|
| **Emma** | Strategic HR Manager | Transparency, compliance, analytics |
| **Derek** | Engineering Manager | Pre-validated candidates to save time |
| **Cordy** | Junior HR Coordinator | Confidence and rapid screening capability |

---

## 2. Technology Stack

### 2.1 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.109.2 | Web framework |
| Python | 3.11 | Programming language |
| SQLAlchemy | 2.0.25 | ORM |
| PostgreSQL | 15 | Database |
| Alembic | 1.13.1 | Database migrations |
| Pydantic | 2.6.1 | Data validation |

### 2.2 Authentication & Security

| Technology | Purpose |
|------------|---------|
| python-jose | JWT token handling |
| bcrypt | Password hashing |
| pyotp | TOTP/2FA (Google Authenticator) |
| qrcode | QR code generation for 2FA setup |

### 2.3 AI Integration

| Technology | Purpose |
|------------|---------|
| NVIDIA API | LLM endpoint |
| LLaMA 3.1-405b | AI model for interviews |
| OpenAI SDK | API client |

### 2.4 Document Processing

| Technology | Purpose |
|------------|---------|
| PyPDF2 | PDF parsing |
| python-docx | DOCX parsing |

### 2.5 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| TypeScript | 5.8.3 | Type safety |
| Vite | 7.1.6 | Build tool |
| React Router | 7.9.1 | Routing |
| Tailwind CSS | 4.1.13 | Styling |
| Lucide React | 0.544.0 | Icons |

### 2.6 Deployment

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Frontend server & reverse proxy |
| Uvicorn | ASGI server for FastAPI |

---

## 3. Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│                    React + TypeScript + Vite                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nginx (Port 80)                             │
│              Serves static files + Reverse proxy                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │ /api/* requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (Port 8000)                    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Auth    │  │Candidate │  │Recruiter │  │   Interview      │ │
│  │  Routes  │  │  Routes  │  │  Routes  │  │   Routes         │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       │             │             │                 │            │
│       └─────────────┴─────────────┴─────────────────┘            │
│                             │                                    │
│              ┌──────────────┴──────────────┐                    │
│              │       Core Services          │                    │
│              │  Security | Database | Config│                    │
│              └──────────────┬───────────────┘                    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │   NVIDIA API    │  │   Email Service │
│   (Port 5432)   │  │   (LLaMA 3.1)   │  │   (Resend)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 3.2 Backend Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py          # Authentication & 2FA endpoints
│   │       ├── candidate.py     # Candidate profile & interviews
│   │       ├── recruiter.py     # Recruiter dashboard & analytics
│   │       ├── interview.py     # AI interview flow
│   │       └── jobs.py          # Job listings management
│   ├── core/
│   │   ├── config.py            # Configuration from environment
│   │   ├── security.py          # JWT, password hashing, RBAC
│   │   └── database.py          # SQLAlchemy engine & session
│   ├── models/
│   │   ├── user.py              # User entity (Candidate/Recruiter)
│   │   ├── interview.py         # Interview sessions & results
│   │   ├── job.py               # Job listings
│   │   └── two_factor.py        # 2FA models
│   ├── schemas/                 # Pydantic schemas
│   ├── services/
│   │   ├── ai_service.py        # CV parsing & interview AI
│   │   ├── totp_service.py      # TOTP/Google Authenticator
│   │   └── email_service.py     # Email notifications
│   └── main.py                  # FastAPI app entry point
├── alembic/                     # Database migrations
├── init_db.py                   # Database initialization
├── Dockerfile
└── requirements.txt
```

### 3.3 Frontend Directory Structure

```
client/src/
├── pages/
│   ├── App.tsx                  # Landing page
│   ├── PersonalCabinet.tsx      # Dashboard (candidate/recruiter)
│   ├── InterviewPage.tsx        # Interview UI
│   ├── InterviewResultPage.tsx  # Results display
│   └── auth/
│       ├── LoginSelector.tsx    # Choose role
│       ├── LoginPage.tsx        # Login form
│       ├── SignupPage.tsx       # Registration
│       └── VerifyOTPPage.tsx    # 2FA verification
├── context/
│   ├── AuthContext.tsx          # Auth state provider
│   └── AuthContextDef.tsx       # Context definition
├── services/
│   └── api.ts                   # API client service
├── types/
│   └── index.ts                 # TypeScript interfaces
└── assets/                      # Images, icons
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌────────────────────────────────────────────────────────────┐
│                          users                              │
├────────────────────────────────────────────────────────────┤
│ id (PK)          │ int          │ Auto-increment           │
│ name             │ varchar(255) │ Not null                 │
│ email            │ varchar(255) │ Unique, Not null, Index  │
│ password         │ varchar(255) │ Bcrypt hash              │
│ role             │ varchar(50)  │ ROLE_CANDIDATE/RECRUITER │
│ info             │ text         │ JSON profile data        │
│ cv               │ text         │ CV content               │
│ two_factor_enabled│ boolean     │ Default: false           │
│ totp_secret      │ varchar(32)  │ Base32 secret            │
│ totp_confirmed   │ boolean      │ Default: false           │
└────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌────────────────────────────────────────────────────────────┐
│                       interviews                            │
├────────────────────────────────────────────────────────────┤
│ id (PK)          │ int          │ Auto-increment           │
│ user_id (FK)     │ int          │ References users.id      │
│ position         │ varchar(255) │ Job title                │
│ company          │ varchar(255) │ Company name             │
│ score            │ int          │ 0-100                    │
│ status           │ varchar(50)  │ pending/in_progress/done │
│ conversation     │ text         │ JSON message array       │
│ assessment       │ text         │ JSON assessment data     │
│ created_at       │ datetime     │ Auto-set                 │
│ completed_at     │ datetime     │ Nullable                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                          jobs                               │
├────────────────────────────────────────────────────────────┤
│ id (PK)          │ int          │ Auto-increment           │
│ title            │ varchar(255) │ Job title                │
│ department       │ varchar(255) │ Department               │
│ description      │ text         │ Full description         │
│ required_skills  │ text         │ JSON array               │
│ preferred_skills │ text         │ JSON array               │
│ min_experience   │ float        │ Years                    │
│ salary_range     │ varchar(100) │ e.g., "$100k-$150k"      │
│ work_mode        │ varchar(50)  │ Remote/Hybrid/Onsite     │
│ is_active        │ int          │ 1 or 0                   │
│ created_at       │ datetime     │ Auto-set                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    two_factor_codes                         │
├────────────────────────────────────────────────────────────┤
│ id (PK)          │ int          │ Auto-increment           │
│ user_id (FK)     │ int          │ References users.id      │
│ code             │ varchar(6)   │ 6-digit OTP              │
│ created_at       │ datetime     │ Auto-set                 │
│ expires_at       │ datetime     │ created_at + 10 min      │
│ is_used          │ boolean      │ Default: false           │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                   two_factor_sessions                       │
├────────────────────────────────────────────────────────────┤
│ id (PK)          │ int          │ Auto-increment           │
│ session_token    │ varchar(255) │ Unique, Index            │
│ user_id (FK)     │ int          │ References users.id      │
│ created_at       │ datetime     │ Auto-set                 │
│ expires_at       │ datetime     │ created_at + 10 min      │
│ is_verified      │ boolean      │ Default: false           │
└────────────────────────────────────────────────────────────┘
```

---

## 5. API Endpoints

### 5.1 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/verify-2fa` | Verify TOTP code | No |
| POST | `/auth/setup-totp` | Generate TOTP QR code | Yes |
| POST | `/auth/confirm-totp` | Confirm TOTP setup | Yes |
| POST | `/auth/disable-totp` | Disable TOTP | Yes |
| GET | `/auth/me` | Get current user | Yes |

**Login Flow Examples:**

```bash
# Standard Login (without 2FA)
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ROLE_CANDIDATE"
  }
}
```

```bash
# Login with 2FA Enabled
POST /api/auth/login

# Response (requires 2FA verification)
{
  "requires_2fa": true,
  "session_token": "abc123...",
  "email": "john@example.com",
  "message": "Enter the code from your authenticator app"
}

# Then verify with TOTP code
POST /api/auth/verify-2fa
{
  "session_token": "abc123...",
  "code": "123456"
}
```

### 5.2 Candidate (`/api/candidate`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/candidate/profile` | Get profile | CANDIDATE |
| PUT | `/candidate/profile` | Update profile | CANDIDATE |
| PATCH | `/candidate/profile/cv` | Update CV | CANDIDATE |
| GET | `/candidate/interviews` | List interviews | CANDIDATE |
| POST | `/candidate/interviews` | Create interview | CANDIDATE |
| GET | `/candidate/interviews/{id}` | Get interview | CANDIDATE |

### 5.3 Recruiter (`/api/recruiter`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/recruiter/candidates` | Get scored candidates | RECRUITER |
| GET | `/recruiter/interviews` | List all interviews | RECRUITER |
| GET | `/recruiter/interviews/{id}` | Get interview details | RECRUITER |
| GET | `/recruiter/stats` | Dashboard statistics | RECRUITER |

**Recruiter Stats Response:**
```json
{
  "total_interviews": 45,
  "completed_interviews": 32,
  "pending_interviews": 13,
  "high_scorers": 8
}
```

### 5.4 Interview (`/api/interview`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/interview/start/{id}` | Start AI interview | Yes |
| POST | `/interview/message/{id}` | Send message | Yes |
| GET | `/interview/result/{id}` | Get results | Yes |
| POST | `/interview/upload-cv` | Upload CV file | Yes |

**Interview Flow:**

```
1. POST /interview/start/{id}
   Response: { "interviewer_message": "Hello! Tell me about..." }

2. POST /interview/message/{id}
   Request: { "message": "I have 5 years of experience..." }
   Response: { "interviewer_message": "Interesting! What about..." }

3. (After 5 exchanges)
   Response: { "is_complete": true }

4. GET /interview/result/{id}
   Response: {
     "score": 82,
     "assessment": {
       "overall_score": 82,
       "skills_match": 8,
       "recommendation": "Yes"
     }
   }
```

### 5.5 Jobs (`/api/jobs`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/jobs` | List jobs | Public |
| GET | `/jobs/{id}` | Get job details | Public |
| POST | `/jobs` | Create job | RECRUITER |
| PUT | `/jobs/{id}` | Update job | RECRUITER |
| DELETE | `/jobs/{id}` | Delete job | RECRUITER |

---

## 6. Security Features

### 6.1 Authentication Methods

#### JWT Token Authentication
- Algorithm: HS256 (HMAC with SHA-256)
- Expiration: 24 hours (configurable)
- Token contains only user email (role fetched from DB)
- Stored in localStorage on client

#### Two-Factor Authentication (TOTP)
- Provider: Google Authenticator compatible
- Algorithm: TOTP (Time-based One-Time Password)
- Code length: 6 digits
- Validity window: 30 seconds (±1 interval tolerance)
- Setup via QR code scanning

### 6.2 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    WITHOUT 2FA                               │
└─────────────────────────────────────────────────────────────┘

  User Input                 Backend                  Response
      │                         │                        │
      │  email + password       │                        │
      ├────────────────────────►│                        │
      │                         │  Verify credentials    │
      │                         │  Check 2FA disabled    │
      │                         │  Generate JWT          │
      │                         ├───────────────────────►│
      │                         │    access_token        │
      │◄────────────────────────┼────────────────────────│

┌─────────────────────────────────────────────────────────────┐
│                      WITH 2FA                                │
└─────────────────────────────────────────────────────────────┘

  User Input                 Backend                  Response
      │                         │                        │
      │  email + password       │                        │
      ├────────────────────────►│                        │
      │                         │  Verify credentials    │
      │                         │  Check 2FA enabled     │
      │                         │  Create temp session   │
      │                         ├───────────────────────►│
      │                         │    session_token       │
      │◄────────────────────────┼────────────────────────│
      │                         │                        │
      │  session_token + TOTP   │                        │
      ├────────────────────────►│                        │
      │                         │  Verify TOTP code      │
      │                         │  Generate JWT          │
      │                         ├───────────────────────►│
      │                         │    access_token        │
      │◄────────────────────────┼────────────────────────│
```

### 6.3 Role-Based Access Control (RBAC)

The platform uses server-side role validation on every request:

```python
class RoleChecker:
    def __call__(self, token, db):
        # 1. Decode JWT token
        payload = decode_token(token)
        email = payload.get("sub")

        # 2. Fetch user from database (source of truth)
        user = db.query(User).filter(User.email == email).first()

        # 3. Validate role against allowed roles
        if user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")

        return user
```

**Important**: Roles are NEVER stored in JWT tokens. The database is always the source of truth.

### 6.4 Password Security

| Feature | Implementation |
|---------|---------------|
| Algorithm | Bcrypt |
| Salt | Automatic (unique per password) |
| Cost factor | Adaptive |
| Verification | Timing-safe comparison |

### 6.5 Security Best Practices Implemented

| Practice | Implementation |
|----------|---------------|
| Input validation | Pydantic models |
| SQL injection prevention | SQLAlchemy ORM |
| XSS prevention | React auto-escaping |
| CORS protection | Whitelist origins |
| Token expiration | 24-hour JWT lifetime |
| Secure password storage | Bcrypt hashing |
| Server-side authorization | Database role lookup |

---

## 7. Application Features

### 7.1 User Registration & Login

**Registration:**
- Choose role: Candidate or Recruiter
- Email validation (format check)
- Password requirements enforced
- 2FA disabled by default

**Login:**
- Email/password authentication
- Automatic 2FA detection
- Session management

### 7.2 Two-Factor Authentication (TOTP)

**Setup Process:**
1. User clicks "Enable 2FA" in settings
2. System generates TOTP secret and QR code
3. User scans QR with Google Authenticator
4. User enters verification code
5. 2FA enabled on successful verification

**Login with 2FA:**
1. User enters email and password
2. System returns session token
3. User enters 6-digit code from authenticator app
4. System validates code and issues JWT

### 7.3 Candidate Features

| Feature | Description |
|---------|-------------|
| Profile Management | Update name, email, personal info |
| CV Upload | Supports PDF, DOCX, DOC, TXT |
| AI CV Parsing | Extracts skills, experience, education |
| Interview Creation | Create for specific position/company |
| AI Interview | 5-round dynamic Q&A session |
| Results Viewing | Score and detailed assessment |

### 7.4 Recruiter Features

| Feature | Description |
|---------|-------------|
| Candidate Screening | View all scored candidates |
| Interview Management | View all interviews across candidates |
| Job Management | Create, update, delete job listings |
| Dashboard Analytics | Statistics and metrics |

### 7.5 AI Interview System

**Interview Flow:**
1. Candidate starts interview
2. AI generates opening question based on CV
3. 5 rounds of Q&A
4. Questions adapt based on candidate responses
5. Final assessment generated

**Assessment Metrics:**
| Metric | Range |
|--------|-------|
| Overall Score | 0-100 |
| Skills Match | 1-10 |
| Cultural Fit | 1-10 |
| Communication | 1-10 |
| Motivation | 1-10 |
| Experience Relevance | 1-10 |

**Recommendation Options:**
- Strong Yes
- Yes
- Maybe
- No

---

## 8. File Structure

### 8.1 Root Directory

```
ai-recruitment-platform/
├── backend/                    # FastAPI backend
├── client/                     # React frontend
├── .env                        # Environment variables
├── .env.example                # Environment template
├── docker-compose.yml          # Docker orchestration
├── railway.json                # Railway deployment config
├── RAILWAY_DEPLOYMENT.md       # Railway deployment guide
├── PROJECT_DOCUMENTATION.md    # This file
├── SECURITY.md                 # Security documentation
├── SETUP.md                    # Setup instructions
└── README.md                   # Project overview
```

### 8.2 Key Backend Files

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app setup, CORS, routing |
| `app/core/config.py` | Environment configuration |
| `app/core/security.py` | JWT, password hashing, RBAC |
| `app/core/database.py` | Database connection |
| `app/models/user.py` | User entity model |
| `app/models/interview.py` | Interview entity model |
| `app/api/routes/auth.py` | Authentication endpoints |
| `app/api/routes/interview.py` | Interview endpoints |
| `app/services/ai_service.py` | AI integration |
| `app/services/totp_service.py` | TOTP/2FA logic |

### 8.3 Key Frontend Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point, routing |
| `src/pages/PersonalCabinet.tsx` | Main dashboard |
| `src/pages/InterviewPage.tsx` | Interview UI |
| `src/context/AuthContext.tsx` | Auth state management |
| `src/services/api.ts` | API client |
| `src/types/index.ts` | TypeScript types |

---

## 9. Deployment

### 9.1 Docker Compose (Local Development)

```yaml
services:
  db:
    image: postgres:15-alpine
    ports: ["5433:5432"]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [db]

  frontend:
    build: ./client
    ports: ["80:80"]
    depends_on: [backend]

  db-init:
    build: ./backend
    command: python init_db.py
    depends_on: [db]
```

**Start Commands:**
```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

### 9.2 Railway Deployment

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Create Railway project
2. Add PostgreSQL database
3. Deploy backend (root: `backend`)
4. Deploy frontend (root: `client`)
5. Configure environment variables
6. Generate domains

### 9.3 Access URLs

| Environment | Frontend | Backend | API Docs |
|-------------|----------|---------|----------|
| Local Docker | http://localhost | http://localhost:8000 | http://localhost:8000/docs |
| Railway | https://your-app.railway.app | https://your-api.railway.app | https://your-api.railway.app/docs |

---

## 10. Environment Variables

### 10.1 Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Authentication
SECRET_KEY=your-secret-key-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Integration
NVIDIA_API_KEY=your-nvidia-api-key
```

### 10.2 Optional Variables

```bash
# Email (for notifications)
RESEND_API_KEY=your-resend-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# 2FA Configuration
OTP_EXPIRE_MINUTES=10
TWO_FACTOR_ENABLED=true

# Application
DEBUG=False
```

### 10.3 Docker-Specific Variables

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=recruitment_db
```

---

## 11. Development Guide

### 11.1 Local Setup (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Database:**
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE recruitment_db;"
```

### 11.2 Testing Credentials

After running `init_db.py`, these accounts are available:

**Candidates:**
| Email | Password |
|-------|----------|
| john.doe@email.com | password123 |
| jane.smith@email.com | password123 |
| mike.johnson@email.com | password123 |

**Recruiters:**
| Email | Password |
|-------|----------|
| sarah@company.com | password123 |
| tom@company.com | password123 |

### 11.3 Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

### 11.4 API Documentation

FastAPI provides automatic interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 11.5 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Database connection fails | Check PostgreSQL is running, verify DATABASE_URL |
| NVIDIA API errors | Verify NVIDIA_API_KEY is set correctly |
| 2FA not working | Check system time (TOTP is time-based) |
| CORS errors | Verify backend CORS_ORIGINS includes frontend URL |
| JWT invalid | Clear localStorage and re-login |

---

## Appendix: Glossary

| Term | Definition |
|------|------------|
| **JWT** | JSON Web Token - compact token format for authentication |
| **TOTP** | Time-based One-Time Password - 2FA mechanism |
| **RBAC** | Role-Based Access Control |
| **ORM** | Object-Relational Mapping |
| **CORS** | Cross-Origin Resource Sharing |
| **ASGI** | Asynchronous Server Gateway Interface |
| **LLM** | Large Language Model |

---

*Document Version: 1.0*
*Last Updated: January 2025*
