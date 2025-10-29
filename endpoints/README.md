# HR Recruitment System - # EndPoints

*Empowering Talent Discovery with Seamless Confidence*
---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)

---

## Overview

The HR Recruitment System is a comprehensive Spring Boot application designed to streamline recruitment processes through role-based candidate management, interview tracking, and recruiter oversight. Built with modern Java technologies, it provides secure, scalable RESTful APIs for managing the complete recruitment workflow.

**Why this HR Recruitment System?**

This project addresses real-world recruitment challenges by providing specialized interfaces for different user types - candidates can manage their profiles and submit interview requests, while recruiters can oversee all interviews and candidate information. The system emphasizes user-friendly email prefix-based URLs and comprehensive data management.

## Features

### �‍💼 **Candidate Management**
- **Profile Cabinet**: Complete profile management with email prefix URLs (`/api/candidate/cabinet/{emailPrefix}`)
- **Interview Requests**: Submit interview applications for specific positions
- **Partial Updates**: Granular updates for personal info and CV sections
- **Role-Based Access**: Secured candidate-only operations

### 👩‍💻 **Recruiter Dashboard**
- **Global Interview View**: Access to all interviews in the system (scored and unscored)
- **Candidate Overview**: Complete candidate profiles with scores and positions
- **Filtering Options**: View only scored interviews or all interview records
- **Email Prefix Authentication**: User-friendly recruiter identification

### 🔐 **Security & Validation**
- **Role-Based Access Control**: CANDIDATE, RECRUITER, ADMIN roles
- **Input Validation**: Jakarta validation with proper error handling
- **Email Prefix URLs**: User-friendly identification system
- **Comprehensive Error Handling**: Consistent HTTP status responses

### 📊 **Data Management**
- **Automatic Data Loading**: Populates 50+ sample users and 20+ interviews on startup
- **PostgreSQL Integration**: Production-ready database with H2 for testing
- **JPA Repositories**: Efficient data access with custom query methods
- **Entity Relationships**: Proper user-interview associations

## API Endpoints

### 🧑‍💼 **Candidate APIs**
```
GET    /api/candidate/cabinet/{emailPrefix}           # Get candidate profile
PUT    /api/candidate/cabinet/{emailPrefix}           # Update complete profile
PATCH  /api/candidate/cabinet/{emailPrefix}/info      # Update info only
PATCH  /api/candidate/cabinet/{emailPrefix}/cv        # Update CV only
POST   /api/candidate/{emailPrefix}/new-interview     # Submit interview request
GET    /api/candidate/{emailPrefix}/interviews        # Get candidate's interviews
```

### 👩‍💻 **Recruiter APIs**
```
GET    /api/recruiter/{emailPrefix}/candidates        # Get scored interviews
GET    /api/recruiter/{emailPrefix}/all-interviews    # Get all interviews
```

### 📋 **General APIs**
```
GET    /api/users                                     # Get all users
GET    /api/users/{id}                                # Get user by ID
GET    /api/users/role/{role}                         # Get users by role
GET    /api/interviews                                # Get all interviews
GET    /api/interviews/{id}                           # Get interview by ID
```

## Architecture

### **Controllers**
- `CandidateProfileController` - Candidate profile management
- `CandidateInterviewRequestController` - Interview request handling
- `RecruiterController` - Recruiter interview oversight

### **Services**
- `UserService` - User operations and email prefix handling
- `InterviewService` - Interview management and scoring

### **DTOs**
- `CandidateProfileDto` - Complete profile updates
- `NewInterviewRequestDto` - Interview request creation
- `RecruiterCandidateViewDto` - Recruiter interview view
- `UpdateInfoDto`, `UpdateCvDto` - Partial updates

### **Models**
- `User` - Users with roles (CANDIDATE, RECRUITER, ADMIN)
- `Interview` - Interview records with scores and positions

---

## Getting Started

### Prerequisites

- **Java 21** or higher
- **Maven 3.6+** for build management
- **PostgreSQL 12+** for production database
- **Git** for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Nickseen/back_interviews
cd back_interviews/hr-recruitment
```

2. **Configure PostgreSQL:**
```bash
# Create database
createdb recruitment_db

# Update application.yaml with your credentials
```

3. **Build the project:**
```bash
mvn clean install
```

4. **Run the application:**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080` and automatically populate sample data.

### Usage

**Access API Documentation:**
- Candidate API: See `CANDIDATE_API.md` for detailed endpoint documentation
- Recruiter API: See `RECRUITER_API.md` for recruiter-specific endpoints

**Sample Usage:**
```bash
# Get candidate profile
curl -X GET "http://localhost:8080/api/candidate/cabinet/johndoe"

# Submit interview request  
curl -X POST "http://localhost:8080/api/candidate/johndoe/new-interview" \
  -H "Content-Type: application/json" \
  -d '{"position": "Senior Java Developer"}'

# View all interviews (recruiter)
curl -X GET "http://localhost:8080/api/recruiter/janesmith/all-interviews"
```

### Testing

The project includes **38 comprehensive tests** covering:
- **Unit Tests**: Controller logic with MockMvc
- **Integration Tests**: End-to-end database operations  
- **Validation Tests**: Input validation and error handling

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=CandidateProfileControllerTest

# Generate test coverage report
mvn test jacoco:report
```

**Test Coverage:**
- 3 Controller test classes
- 1 Integration test class
- 38 total test methods with 100% pass rate

### Database

The application uses **automatic data loading** on startup:
- **53 Users**: 30 candidates, 18 recruiters, 2 admins
- **21 Interviews**: Mix of scored and unscored interview records
- **Email-based URLs**: User-friendly email prefix identification

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

[⬆ Return to top](#hr-recruitment-system---back_interviews)
