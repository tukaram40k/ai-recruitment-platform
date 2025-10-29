# Recruiter API Documentation

## Overview
This API provides endpoints for recruiters to view all interviews and candidate information in the system.

## Base URL
`/api/recruiter`

## Endpoints

### 1. Get Scored Candidates
- **Method:** GET
- **URL:** `/api/recruiter/{emailPrefix}/candidates`
- **Description:** Retrieve all interviews that have been scored (score > 0)
- **Path Parameters:**
  - `emailPrefix` (String): The part of the recruiter's email before @ (e.g., "janesmith" for "janesmith@example.com")
- **Response:** Array of RecruiterCandidateViewDto objects with scored interviews only
- **Status Codes:**
  - 200: Success
  - 400: User is not a recruiter
  - 404: User not found

### 2. Get All Interviews
- **Method:** GET
- **URL:** `/api/recruiter/{emailPrefix}/all-interviews`
- **Description:** Retrieve all interviews in the system (both scored and unscored)
- **Path Parameters:**
  - `emailPrefix` (String): The part of the recruiter's email before @ (e.g., "janesmith" for "janesmith@example.com")
- **Response:** Array of RecruiterCandidateViewDto objects with all interviews
- **Status Codes:**
  - 200: Success
  - 400: User is not a recruiter
  - 404: User not found

## Response DTO

### RecruiterCandidateViewDto
```json
{
  "interviewId": 1,
  "candidateId": 123,
  "candidateName": "John Doe",
  "candidateEmail": "johndoe@example.com",
  "position": "Senior Java Developer",
  "score": 85,
  "candidateInfo": "Software Developer with 5 years experience",
  "candidateCv": "Experienced Java developer..."
}
```

## Field Descriptions
- **interviewId**: Unique identifier for the interview
- **candidateId**: Unique identifier for the candidate
- **candidateName**: Full name of the candidate
- **candidateEmail**: Email address of the candidate
- **position**: Position the candidate applied for
- **score**: Interview score (0 means unscored, >0 means scored)
- **candidateInfo**: Brief information about the candidate
- **candidateCv**: Candidate's CV content

## Usage Examples

### Get Scored Candidates
```bash
GET /api/recruiter/janesmith/candidates
```

Response:
```json
[
  {
    "interviewId": 1,
    "candidateId": 123,
    "candidateName": "John Doe",
    "candidateEmail": "johndoe@example.com",
    "position": "Senior Java Developer",
    "score": 85,
    "candidateInfo": "Software Developer",
    "candidateCv": "Experienced Java developer with 3 years experience"
  }
]
```

### Get All Interviews
```bash
GET /api/recruiter/janesmith/all-interviews
```

Response:
```json
[
  {
    "interviewId": 1,
    "candidateId": 123,
    "candidateName": "John Doe",
    "candidateEmail": "johndoe@example.com",
    "position": "Senior Java Developer",
    "score": 85,
    "candidateInfo": "Software Developer",
    "candidateCv": "Experienced Java developer with 3 years experience"
  },
  {
    "interviewId": 2,
    "candidateId": 124,
    "candidateName": "Jane Smith",
    "candidateEmail": "janesmith@example.com",
    "position": "Frontend Developer",
    "score": 0,
    "candidateInfo": "UI/UX Designer",
    "candidateCv": "Creative designer with React experience"
  }
]
```

## Security Notes
- All endpoints verify that the user with the given email prefix has the ROLE_RECRUITER role
- Recruiters can only access these endpoints if they are authenticated as recruiters
- The system returns all interviews globally, not just recruiter-specific ones
- Email prefixes are used as user-friendly identifiers instead of numeric IDs

## Error Handling
- 400 Bad Request: User exists but is not a recruiter
- 404 Not Found: User with given email prefix doesn't exist
- All endpoints use consistent error handling patterns