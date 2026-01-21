# Security Documentation

This document provides a comprehensive overview of all security measures implemented in the AI Recruitment Platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Authorization](#authorization)
3. [Password Security](#password-security)
4. [Token Security](#token-security)
5. [API Security](#api-security)
6. [Data Protection](#data-protection)
7. [Frontend Security](#frontend-security)
8. [Security Architecture](#security-architecture)

---

## Authentication

### JWT-Based Authentication

The platform uses JSON Web Tokens (JWT) for stateless authentication.

**Implementation Details:**
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Token Expiration:** 24 hours (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Token Location:** `Authorization: Bearer <token>` header

**Token Payload:**
```json
{
  "sub": "user@example.com",
  "exp": 1234567890
}
```

**Key Security Feature:** The JWT only contains the user's email as the subject (`sub`). The user's role is **never stored in the token**. This prevents token manipulation attacks where an attacker might try to modify the token payload to escalate privileges.

**Files:**
- `backend/app/core/security.py` - Token creation and validation
- `backend/app/core/config.py` - Security configuration

---

## Authorization

### Role-Based Access Control (RBAC)

The platform implements a two-tier role system:

| Role | Value | Description |
|------|-------|-------------|
| Candidate | `ROLE_CANDIDATE` | Job seekers who take AI interviews |
| Recruiter | `ROLE_RECRUITER` | HR professionals who review candidates |

### Server-Side Role Validation

**Critical Security Measure:** User roles are **always** validated server-side by fetching the user from the database on every authenticated request. This prevents any client-side role manipulation.

**How it works:**
1. Client sends JWT token in request header
2. Server decodes token to get user email
3. Server queries database to get the actual user record
4. Server checks the role from the database (not from any client-provided data)
5. If role doesn't match required role, returns 403 Forbidden

**Implementation:**
```python
class RoleChecker:
    """
    Dependency class for role-based authorization.
    The role is ALWAYS fetched from the database, never trusted from client.
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, token, db):
        # Decode token to get email
        # Fetch user from DATABASE (source of truth)
        # Validate role against allowed_roles
        # Return 403 if unauthorized
```

**Pre-configured Role Checkers:**
- `require_candidate` - Only candidates can access
- `require_recruiter` - Only recruiters can access
- `require_candidate_or_recruiter` - Either role can access

### Protected Endpoints

| Endpoint Pattern | Required Role | Description |
|-----------------|---------------|-------------|
| `/api/candidate/*` | ROLE_CANDIDATE | Candidate profile and interviews |
| `/api/recruiter/*` | ROLE_RECRUITER | Recruiter dashboard and candidate viewing |
| `/api/interview/*` | ROLE_CANDIDATE | Taking AI interviews |
| `/api/jobs` (POST/PUT/DELETE) | ROLE_RECRUITER | Job management |
| `/api/jobs` (GET) | Public | Viewing job listings |
| `/api/auth/*` | Public | Login and registration |

**Files:**
- `backend/app/core/security.py` - RoleChecker class
- `backend/app/api/routes/*.py` - Route-level authorization

---

## Password Security

### Bcrypt Hashing

All passwords are hashed using bcrypt before storage.

**Why Bcrypt:**
- Adaptive cost factor (work factor can be increased over time)
- Built-in salt generation
- Resistant to rainbow table attacks
- Computationally expensive (slows down brute-force attacks)

**Implementation:**
```python
import bcrypt

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )
```

**Security Properties:**
- Passwords are never stored in plain text
- Each password has a unique salt
- Verification is timing-safe (prevents timing attacks)

**Files:**
- `backend/app/core/security.py` - Password hashing functions

---

## Token Security

### Token Handling

**Server-Side:**
- Tokens are signed with a secret key stored in environment variables
- Token expiration is enforced on every request
- Invalid/expired tokens return 401 Unauthorized

**Client-Side:**
- Tokens are stored in `localStorage`
- Tokens are included in all authenticated requests via `Authorization` header
- Tokens are cleared on logout

### Token Validation Flow

```
1. Extract token from Authorization header
2. Decode and verify JWT signature
3. Check token expiration
4. Extract user email from token
5. Fetch user from database
6. Verify user exists and is active
7. Return user object for route handler
```

**Files:**
- `backend/app/core/security.py` - `decode_token()`, `get_current_user()`
- `client/src/services/api.ts` - Token storage and transmission

---

## API Security

### Input Validation

All API inputs are validated using Pydantic models:

```python
class UserCreate(BaseModel):
    name: str
    email: EmailStr  # Validates email format
    password: str
    role: RoleEnum   # Only allows valid role values
```

**Validation Features:**
- Type checking
- Email format validation
- Enum value restriction
- Required field enforcement
- Optional field handling

### SQL Injection Prevention

The application uses SQLAlchemy ORM with parameterized queries:

```python
# Safe - parameterized query
user = db.query(User).filter(User.email == email).first()

# Never used - raw SQL with string concatenation
# db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

### CORS Configuration

Cross-Origin Resource Sharing is configured to allow only trusted origins:

```python
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:80",
    "http://localhost",
    "http://frontend",
    "http://frontend:80"
]
```

**Files:**
- `backend/app/main.py` - CORS middleware configuration
- `backend/app/core/config.py` - CORS origins list

---

## Data Protection

### Sensitive Data Handling

| Data Type | Protection Method |
|-----------|------------------|
| Passwords | Bcrypt hashing |
| JWT Secret | Environment variable |
| User emails | Database encryption (at rest) |
| Interview conversations | Database storage with access control |

### Database Security

- SQLAlchemy ORM prevents SQL injection
- Foreign key constraints ensure data integrity
- User IDs are used for relationships (not emails)

**Files:**
- `backend/app/core/database.py` - Database connection
- `backend/app/models/*.py` - Data models

---

## Frontend Security

### Authentication State

The frontend maintains authentication state in React Context:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

**Important:** Frontend role information is for UI purposes only. All authorization decisions are made server-side.

### API Error Handling

The frontend handles authorization errors gracefully:

- **401 Unauthorized:** Token cleared, user redirected to login
- **403 Forbidden:** User shown access denied message

**Files:**
- `client/src/context/AuthContext.tsx` - Auth state management
- `client/src/services/api.ts` - API client with error handling

---

## Security Architecture

### Defense in Depth

The platform implements multiple layers of security:

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  • Token storage • UI role checks • Input validation    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CORS Middleware                       │
│           • Origin validation • Method filtering         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Authentication Middleware                  │
│    • JWT validation • Token expiration • User lookup     │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Authorization (RoleChecker)                │
│     • Database role fetch • Role validation • 403        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Route Handler                          │
│      • Input validation • Business logic • Response      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Database                            │
│     • Parameterized queries • Data integrity             │
└─────────────────────────────────────────────────────────┘
```

### Security Flow for Protected Request

```
1. User makes request with JWT token
2. CORS middleware validates origin
3. OAuth2PasswordBearer extracts token
4. JWT signature and expiration verified
5. User email extracted from token
6. User fetched from database (role = source of truth)
7. RoleChecker validates user.role against required roles
8. If authorized: request proceeds
   If unauthorized: 403 Forbidden returned
```

---

## Security Best Practices Implemented

| Practice | Implementation |
|----------|---------------|
| Never trust client input | Server-side validation for all data |
| Least privilege | Role-based access with minimal permissions |
| Defense in depth | Multiple security layers |
| Secure password storage | Bcrypt with automatic salting |
| Token-based auth | JWT with expiration |
| Server-side authorization | Database-fetched roles |
| Input validation | Pydantic models |
| SQL injection prevention | ORM with parameterized queries |
| CORS protection | Whitelist of allowed origins |

---

## Configuration

Security settings are managed via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | (required) |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | 1440 (24h) |
| `DEBUG` | Debug mode | False |
| `CORS_ORIGINS` | Allowed origins | localhost only |

**Files:**
- `backend/app/core/config.py` - Configuration class
- `.env` - Environment variables (not in repo)

---

## Security Contacts

For security concerns or vulnerability reports, please contact the development team.
