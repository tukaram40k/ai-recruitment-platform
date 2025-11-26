# AI Recruitment Platform - Setup Guide

This guide will help you set up and run the AI Recruitment Platform.

## Quick Start with Docker (Recommended)

The easiest way to run the entire platform - no dependencies to install!

### Prerequisites
- **Docker** and **Docker Compose** installed

### Run with Docker

```bash
# Clone/navigate to the project
cd ai-recruitment-platform

# Start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

That's it! The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 80 | React app with Nginx |
| backend | 8000 | FastAPI Python backend |
| db | 5432 | PostgreSQL database |

### Stop Docker Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

## Manual Setup (Development)

If you prefer to run services manually for development.

### Prerequisites

- **Python 3.10+** - For the backend
- **Node.js 18+** - For the frontend
- **PostgreSQL 12+** - Database
- **NVIDIA API Key** - For AI features (already configured in `.env`)

### Project Structure

```
ai-recruitment-platform/
├── backend/           # Python FastAPI backend
│   ├── app/
│   │   ├── api/routes/    # API endpoints
│   │   ├── core/          # Config, security, database
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic & AI service
│   ├── requirements.txt
│   ├── Dockerfile
│   └── init_db.py         # Database initialization
├── client/            # React TypeScript frontend
│   ├── src/
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # Docker orchestration
├── recruitment-model/ # Original AI model simulation
└── .env              # Environment variables
```

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE recruitment_db;
```

Or using psql:
```bash
psql -U postgres -c "CREATE DATABASE recruitment_db;"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and seed data
python init_db.py

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

---

## Default Test Accounts

After starting the application, the following test accounts are available:

### Candidates:
| Email | Password |
|-------|----------|
| john.doe@email.com | password123 |
| jane.smith@email.com | password123 |
| mike.johnson@email.com | password123 |

### Recruiters:
| Email | Password |
|-------|----------|
| sarah@company.com | password123 |
| tom@company.com | password123 |

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Candidate Endpoints
- `GET /api/candidate/profile` - Get profile
- `PUT /api/candidate/profile` - Update profile
- `GET /api/candidate/interviews` - Get my interviews
- `POST /api/candidate/interviews` - Create new interview

### Recruiter Endpoints
- `GET /api/recruiter/candidates` - Get scored candidates
- `GET /api/recruiter/interviews` - Get all interviews
- `GET /api/recruiter/stats` - Get dashboard stats

### Interview Endpoints (AI)
- `POST /api/interview/start/{id}` - Start AI interview
- `POST /api/interview/message/{id}` - Send message to interviewer
- `GET /api/interview/result/{id}` - Get interview results
- `POST /api/interview/upload-cv` - Upload and parse CV

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

---

## Features

### For Candidates
1. **Register/Login** - Create account or login
2. **Personal Dashboard** - View interview history and scores
3. **Take AI Interview** - Chat-based interview with AI interviewer
4. **View Results** - See detailed assessment and scores
5. **Upload CV** - Parse CV using AI

### For Recruiters
1. **Dashboard** - View all candidate interviews
2. **Search & Filter** - Find candidates by name/position
3. **View Detailed Results** - See conversation and assessment
4. **Manage Jobs** - Create and manage job listings

---

## Technology Stack

### Backend (Python)
- FastAPI - Web framework
- SQLAlchemy - ORM
- PostgreSQL - Database
- JWT - Authentication
- NVIDIA LLM API - AI features

### Frontend (React)
- React 19 with TypeScript
- React Router v7
- Tailwind CSS
- Lucide Icons
- Vite

### Infrastructure
- Docker & Docker Compose
- Nginx (production frontend)

---

## Environment Variables

The `.env` file in the root directory:

```env
# NVIDIA API for AI features
NVIDIA_API_KEY=your-api-key

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=recruitment_db
DATABASE_URL=postgresql://postgres:admin@db:5432/recruitment_db

# JWT (auto-generated secure key)
SECRET_KEY=your-secure-jwt-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server
DEBUG=True
```

---

## Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Check what's using port 80
netstat -ano | findstr :80
# Or use different ports in docker-compose.yml
```

**Container not starting:**
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose up --build --force-recreate
```

### Database Connection Error
- Ensure PostgreSQL is running (or use Docker)
- Check DATABASE_URL in `.env`
- For Docker: ensure `db` service is healthy

### CORS Error
- Backend CORS is configured for localhost ports
- Check if frontend is running on expected port

### AI Features Not Working
- Verify NVIDIA_API_KEY in `.env` is valid
- Check internet connection
- API rate limits may apply

---

## Development

### Adding New API Endpoints
1. Create route in `backend/app/api/routes/`
2. Add schemas in `backend/app/schemas/`
3. Include router in `backend/app/main.py`

### Adding New Frontend Pages
1. Create component in `client/src/pages/`
2. Add route in `client/src/main.tsx`
3. Update API service if needed

### Rebuilding Docker Images
```bash
# After code changes
docker-compose up --build

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up
```
