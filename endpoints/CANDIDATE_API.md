# Candidate Profile API Documentation

## Overview
This API provides endpoints for candidates to manage their personal cabinet/profile information using email prefixes as identifiers.

## Base URL
`/api/candidate/cabinet`

## Endpoints

### 1. Get Candidate Profile
- **Method:** GET
- **URL:** `/api/candidate/cabinet/{emailPrefix}`
- **Description:** Retrieve candidate profile information
- **Path Parameters:**
  - `emailPrefix` (String): The part of the email before @ (e.g., "petcovnicola" for "petcovnicola@gmail.com")
- **Response:** User object with candidate information
- **Status Codes:**
  - 200: Success
  - 400: User is not a candidate
  - 404: User not found

### 2. Update Complete Candidate Profile
- **Method:** PUT
- **URL:** `/api/candidate/cabinet/{emailPrefix}`
- **Description:** Update candidate's complete profile (name, info, CV)
- **Path Parameters:**
  - `emailPrefix` (String): The part of the email before @ (e.g., "petcovnicola" for "petcovnicola@gmail.com")
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "info": "Experienced software developer with 5+ years...",
    "cv": "CV content in text or URL format"
  }
  ```
- **Response:** Updated User object
- **Status Codes:**
  - 200: Success
  - 400: Validation error or user is not a candidate
  - 404: User not found

### 3. Update Candidate Info Only
- **Method:** PATCH
- **URL:** `/api/candidate/cabinet/{emailPrefix}/info`
- **Description:** Update only the candidate's info field
- **Path Parameters:**
  - `emailPrefix` (String): The part of the email before @ (e.g., "petcovnicola" for "petcovnicola@gmail.com")
- **Request Body:**
  ```json
  {
    "info": "Updated professional information"
  }
  ```
- **Response:** Updated User object
- **Status Codes:**
  - 200: Success
  - 400: User is not a candidate
  - 404: User not found

### 4. Update Candidate CV Only
- **Method:** PATCH
- **URL:** `/api/candidate/cabinet/{emailPrefix}/cv`
- **Description:** Update only the candidate's CV
- **Path Parameters:**
  - `emailPrefix` (String): The part of the email before @ (e.g., "petcovnicola" for "petcovnicola@gmail.com")
- **Request Body:**
  ```json
  {
    "cv": "Updated CV content or URL"
  }
  ```
- **Response:** Updated User object
- **Status Codes:**
  - 200: Success
  - 400: User is not a candidate
  - 404: User not found

## DTOs

### CandidateProfileDto
```java
{
  "name": "string (required, not blank)",
  "info": "string (optional)",
  "cv": "string (optional)"
}
```

### UpdateInfoDto
```java
{
  "info": "string"
}
```

### UpdateCvDto
```java
{
  "cv": "string"
}
```

## Security Notes
- All endpoints verify that the user with the given ID has the ROLE_CANDIDATE role
- Only candidates can access and modify their profile through these endpoints
- Cross-Origin Resource Sharing (CORS) is enabled for all origins

## Example Usage

### Update complete profile:
```bash
curl -X PUT http://localhost:8080/api/candidate/cabinet/petcovnicola \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "info": "Senior Java Developer with Spring Boot expertise",
    "cv": "https://example.com/johndoe-cv.pdf"
  }'
```

### Update only info:
```bash
curl -X PATCH http://localhost:8080/api/candidate/cabinet/petcovnicola/info \
  -H "Content-Type: application/json" \
  -d '{
    "info": "Updated professional summary"
  }'
```

### Update only CV:
```bash
curl -X PATCH http://localhost:8080/api/candidate/cabinet/petcovnicola/cv \
  -H "Content-Type: application/json" \
  -d '{
    "cv": "New CV content"
  }'
```