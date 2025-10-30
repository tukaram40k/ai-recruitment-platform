# PBL Team 11: AI Recruiter & Automated CV Screening System
## Abstract
Traditional manual CV screening in IT recruitment is slow, costly, and prone to inconsistency and unconscious bias. Our **AI Recruiter** introduces a scalable multi-agent AI platform that automates CV parsing, candidate profiling, dynamic interviewing, and final scoring. By replacing subjective human decision-making with standardized, data-driven evaluation* the system improves fairness and dramatically reduces Time-to-Hire (TTH).

Key achievements:
- Domain analysis validated demand through 3 core personas
- System design aligns with enterprise-grade stack: **React/TypeScript + Java Spring**
- Emphasis on **GDPR compliance**, high scalability, and*algorithmic fairness
- Transparent evaluations via Explainable AI principles

**Goal:** transform recruitment from slow administrative work into a strategic and consistent talent acquisition function.

**Keywords:** `AI Recruitment`, `CV Parsing`, `Bias Mitigation`, `Multi-Agent System`, `Large Language Models`, `Dynamic Interviewing`, `Time-to-Hire`, `GDPR Compliance`, `Explainable AI`

## Introduction
IT hiring involves high-volume applicant flows that overwhelm manual review processes.

Problems with traditional screening:
- Slower hiring processes risk losing top talent
- Human fatigue creates inconsistencies and oversights
- Unconscious bias reduces workforce diversity
- Minimal use of historical performance data

### Value Proposition
The AI Recruiter:
- Reduces operational burden on HR and hiring managers
- Delivers **pre-qualified** candidates for later interview stages
- Provides **audit-ready** transparent evaluations for compliance

### Who Benefits?
| Personas     | Benefits from AI Recruiter                      |
|--------------|-------------------------------------------------|
| **HRs**      | Trusted, data-backed decision-making            |
| **Managers** | Eliminated early-stage interviews               |
| **Juniors**  | Reliable automation and confidence in screening |

## Domain Analysis

### Problem Overview

#### Major Challenges in Manual Screening
- **Time and Cost**
    - Hours spent reviewing candidates who are low quality
    - Time-to-Hire increases significantly
    - Human scalability is limited

- **Subjectivity and Bias**
    - Different reviewers judge differently
    - Cognitive fatigue leads to poor attention
    - Bias from names, schooling, formatting, etc.

- **Lack of Data-Driven Decisions**
    - No benchmarking against past successful hires
    - Keyword scanning instead of deep skill evaluation
    - Technical managers waste time interviewing unfit candidates

---

## Target Audience

### Core User Roles
1. **Senior HR Strategist (Emma)**
    - Needs transparency, compliance, strategic analytics

2. **Engineering Manager (Derek)**
    - Needs technically pre-validated candidates to save time

3. **Junior HR Coordinator (Cordy)**
    - Needs confidence and a simple system for rapid screening

---

## User Personas
(Persona cards included as figures in the report)
- Emma (Strategic HR)
- Derek (Time-Strapped Hiring Manager)
- Cordy (Overwhelmed Junior Processor)

## Solution Concept

### Multi-Agent AI Pipeline Architecture
Candidate processing stages:

1. **Secure Upload & Storage**
    - File stored via Java Spring backend with GDPR compliance

2. **CV Parsing Agent**
    - Extracts education, skills, experience contextually

3. **Profiling Agent**
    - Role-based match score against job requirements

4. **Dynamic Interview Agent**
    - Personalized LLM-driven question flow based on CV data

5. **Scoring Agent**
    - Combined objective score and a recommendation label:
        - Recommended
        - Consider
        - Not Suitable

### What Changes Compared to Manual Hiring?
| Before (Manual)           | After (AI Recruiter)                    |
|---------------------------|-----------------------------------------|
| Keyword scanning          | Deep skill & context analysis           |
| Human bias                | Aligned, fair scoring logic             |
| Recruiter-led interview   | Automated conversation                  |
| Subjective recommendation | Transparent decision with justification |

---

## Conclusions

Confirmed core user needs: efficiency, transparency, fairness  
Multi-agent design validated as best architecture  
Non-functional requirements clearly defined:
- **Consistency** to eliminate bias
- **Security** including GDPR compliance
- **Scalability** for high-volume hiring

### Next Steps
- Finalize full technical stack justification, especially backend
- Select LLM solution (GPT, Claude, hybrid, or fully local models)
- Create complete system architecture diagram including:
    - Data flow
    - Security boundaries
    - LLM integration stages
- Special focus on:
    - Robust parsing of diverse CV formats
    - Explainable AI via **RAG** and context engineering

## Members
- Costov Maxim (`FAF-232`)
- Cvasiuc Dmitrii (`FAF-232`)
- Rudenco Ivan (`FAF-232`)
- Tatarintev Denis (`FAF-232`)
- Petcov Nicolai (`FAF-233`)
