import os
import json
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from openai import OpenAI
import PyPDF2
import docx
from io import BytesIO

from ..core.config import settings


@dataclass
class CandidateProfile:
    name: str
    email: str
    phone: str
    current_position: str
    years_of_experience: float
    skills: List[str]
    education: List[Dict[str, str]]
    work_history: List[Dict[str, str]]
    certifications: List[str] = None
    languages: List[str] = None

    def to_context(self) -> str:
        context = f"""
Candidate Profile:
- Name: {self.name}
- Current Position: {self.current_position}
- Years of Experience: {self.years_of_experience}
- Skills: {', '.join(self.skills)}

Education:
{self._format_list(self.education)}

Work History:
{self._format_list(self.work_history)}
"""
        if self.certifications:
            context += f"\nCertifications: {', '.join(self.certifications)}"
        if self.languages:
            context += f"\nLanguages: {', '.join(self.languages)}"

        return context

    def _format_list(self, items: List[Dict]) -> str:
        if not items:
            return "  No information available"
        return '\n'.join([f"  - {', '.join(f'{k}: {v}' for k, v in item.items())}"
                         for item in items])


@dataclass
class JobRequirements:
    position_title: str
    department: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience_years: float
    job_description: str
    salary_range: Optional[str] = None
    work_mode: str = "Hybrid"


class AIService:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.NVIDIA_API_KEY
        )
        self.model = "meta/llama-3.1-405b-instruct"

    def read_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file content"""
        text = ""
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def read_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file content"""
        doc = docx.Document(BytesIO(file_content))
        return '\n'.join([paragraph.text for paragraph in doc.paragraphs])

    def read_cv(self, file_content: bytes, filename: str) -> str:
        """Read CV content based on file extension"""
        ext = os.path.splitext(filename)[1].lower()
        if ext == '.pdf':
            return self.read_pdf(file_content)
        elif ext in ['.docx', '.doc']:
            return self.read_docx(file_content)
        elif ext == '.txt':
            return file_content.decode('utf-8')
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def extract_profile(self, cv_text: str) -> CandidateProfile:
        """Extract candidate profile from CV text using AI"""
        prompt = f"""Extract the following information from this CV and return ONLY valid JSON with this exact structure:

{{
  "name": "string",
  "email": "string",
  "phone": "string",
  "current_position": "string",
  "years_of_experience": float,
  "skills": ["skill1", "skill2"],
  "education": [{{"degree": "string", "institution": "string", "year": "string"}}],
  "work_history": [{{"position": "string", "company": "string", "duration": "string", "description": "string"}}],
  "certifications": ["cert1", "cert2"],
  "languages": ["lang1", "lang2"]
}}

CV Text:
{cv_text}

Return ONLY the JSON, no other text."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a CV parsing assistant. Extract information and return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=2000
        )

        content = response.choices[0].message.content.strip()

        # Clean up markdown code blocks if present
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()

        data = json.loads(content)

        return CandidateProfile(
            name=data.get("name", "Unknown"),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            current_position=data.get("current_position", ""),
            years_of_experience=float(data.get("years_of_experience", 0)),
            skills=data.get("skills", []),
            education=data.get("education", []),
            work_history=data.get("work_history", []),
            certifications=data.get("certifications", []),
            languages=data.get("languages", [])
        )


class InterviewSimulator:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.NVIDIA_API_KEY
        )
        self.model = "meta/llama-3.1-405b-instruct"
        self.conversation_history: List[Dict[str, str]] = []
        self.candidate_profile: Optional[str] = None
        self.job_info: Optional[Dict] = None
        self.questions_count = 0
        self.max_questions = 5

    def initialize(self, candidate_cv: str, job_position: str, job_description: str = None):
        """Initialize interview session"""
        self.conversation_history = []
        self.questions_count = 0

        self.candidate_profile = candidate_cv
        self.job_info = {
            "position": job_position,
            "description": job_description or f"Interview for {job_position} position"
        }

        system_prompt = self._create_system_prompt()
        self.conversation_history.append({
            "role": "system",
            "content": system_prompt
        })

    def _create_system_prompt(self) -> str:
        return f"""You are an experienced HR interviewer conducting a professional interview for the position of {self.job_info['position']}.

Candidate Information:
{self.candidate_profile}

Job Description:
{self.job_info['description']}

Your responsibilities:
1. Conduct a natural, conversational HR interview
2. Ask relevant questions about the candidate's experience, skills, and motivation
3. Assess cultural fit and career goals
4. Be professional, friendly, and encouraging
5. Ask follow-up questions based on candidate responses
6. Cover topics: background, experience, skills, motivation, career goals
7. Keep responses concise (2-4 sentences typically)
8. Ask one question at a time

Interview Flow:
- Start with a warm introduction
- Ask about their background and experience
- Discuss relevant skills
- Explore motivation for this role
- End with next steps after {self.max_questions} questions total (including the introduction)

IMPORTANT: Only ask ONE question at a time. Wait for the candidate's response before asking the next question."""

    def get_next_message(self, candidate_response: Optional[str] = None) -> Dict[str, Any]:
        """Get next interviewer message based on candidate's response"""
        if candidate_response:
            self.conversation_history.append({
                "role": "user",
                "content": candidate_response
            })
            self.questions_count += 1

        # Check if interview should end
        is_complete = self.questions_count >= self.max_questions

        if is_complete:
            # Generate closing message
            closing_prompt = "Thank the candidate for their time and let them know we will be in touch with next steps. Keep it brief and professional."
            self.conversation_history.append({
                "role": "system",
                "content": closing_prompt
            })

        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.conversation_history,
            temperature=0.7,
            top_p=0.9,
            max_tokens=500
        )

        interviewer_message = response.choices[0].message.content

        self.conversation_history.append({
            "role": "assistant",
            "content": interviewer_message
        })

        return {
            "message": interviewer_message,
            "is_complete": is_complete,
            "questions_asked": self.questions_count
        }

    def generate_assessment(self) -> Dict[str, Any]:
        """Generate final assessment of the interview"""
        assessment_prompt = f"""Based on the interview conversation, provide a comprehensive assessment of the candidate for the {self.job_info['position']} position.

Evaluate and return a JSON object with:
{{
    "overall_score": <1-100>,
    "skills_match": <1-10>,
    "cultural_fit": <1-10>,
    "communication": <1-10>,
    "motivation": <1-10>,
    "experience_relevance": <1-10>,
    "strengths": ["strength1", "strength2", "strength3"],
    "concerns": ["concern1", "concern2"],
    "recommendation": "Strong Yes | Yes | Maybe | No",
    "summary": "2-3 sentence summary of the candidate"
}}

Return ONLY the JSON, no other text."""

        assessment_messages = self.conversation_history + [{
            "role": "user",
            "content": assessment_prompt
        }]

        response = self.client.chat.completions.create(
            model=self.model,
            messages=assessment_messages,
            temperature=0.3,
            max_tokens=1000
        )

        content = response.choices[0].message.content.strip()

        # Clean up markdown code blocks if present
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()

        try:
            assessment = json.loads(content)
        except json.JSONDecodeError:
            assessment = {
                "overall_score": 50,
                "raw_assessment": content,
                "error": "Failed to parse assessment"
            }

        return assessment

    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Get conversation history without system messages"""
        return [msg for msg in self.conversation_history if msg["role"] != "system"]


# Singleton instances
_ai_service: Optional[AIService] = None
_interview_sessions: Dict[int, InterviewSimulator] = {}


def get_ai_service() -> AIService:
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service


def get_interview_session(interview_id: int) -> InterviewSimulator:
    if interview_id not in _interview_sessions:
        _interview_sessions[interview_id] = InterviewSimulator()
    return _interview_sessions[interview_id]


def remove_interview_session(interview_id: int):
    if interview_id in _interview_sessions:
        del _interview_sessions[interview_id]
