import os
import json
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
import PyPDF2
import docx

load_dotenv()

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
        return '\n'.join([f"  • {', '.join(f'{k}: {v}' for k, v in item.items())}" 
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


class CVExtractor:
    def __init__(self, api_key: str, model: str = "meta/llama-3.1-405b-instruct"):
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        self.model = model
    
    def read_pdf(self, file_path: str) -> str:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    def read_docx(self, file_path: str) -> str:
        doc = docx.Document(file_path)
        return '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    
    def read_cv(self, file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.pdf':
            return self.read_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            return self.read_docx(file_path)
        elif ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            raise ValueError(f"Unsupported file format: {ext}")
    
    def extract_profile(self, cv_text: str) -> CandidateProfile:
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


class HRInterviewSimulator:
    def __init__(self, api_key: str, model: str = "meta/llama-3.1-405b-instruct"):
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        self.model = model
        self.conversation_history: List[Dict[str, str]] = []
        self.candidate: Optional[CandidateProfile] = None
        self.job: Optional[JobRequirements] = None
        self.interview_stage: str = "introduction"
        self.questions_asked: List[str] = []
        self.assessment_notes: List[str] = []
        
    def initialize_interview(self, candidate: CandidateProfile, job: JobRequirements):
        self.candidate = candidate
        self.job = job
        self.conversation_history = []
        self.questions_asked = []
        self.assessment_notes = []
        self.interview_stage = "introduction"
        
        system_prompt = self._create_system_prompt()
        self.conversation_history.append({
            "role": "system",
            "content": system_prompt
        })
        
    def _create_system_prompt(self) -> str:
        return f"""You are an experienced HR interviewer conducting a professional interview for the position of {self.job.position_title} in the {self.job.department} department.

{self.candidate.to_context()}

Job Requirements:
- Position: {self.job.position_title}
- Department: {self.job.department}
- Required Skills: {', '.join(self.job.required_skills)}
- Preferred Skills: {', '.join(self.job.preferred_skills)}
- Minimum Experience: {self.job.min_experience_years} years
- Work Mode: {self.job.work_mode}
- Job Description: {self.job.job_description}
{f"- Salary Range: {self.job.salary_range}" if self.job.salary_range else ""}

Your responsibilities:
1. Conduct a natural, conversational HR interview
2. Ask relevant questions about the candidate's experience, skills, and motivation
3. Assess cultural fit and career goals
4. Be professional, friendly, and encouraging
5. Ask follow-up questions based on candidate responses
6. Cover topics: background, experience, skills, motivation, career goals, availability
7. Keep responses concise and natural (2-4 sentences typically)
8. Don't ask all questions at once - have a conversation

Interview Stages:
- Introduction: Welcome and brief overview
- Background: Education and work history
- Skills Assessment: Technical and soft skills
- Motivation: Why this role and company
- Closing: Questions from candidate, next steps

Start with a warm introduction and proceed naturally through the interview."""

    def ask_question(self, candidate_response: Optional[str] = None) -> str:
        if candidate_response:
            self.conversation_history.append({
                "role": "user",
                "content": candidate_response
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
        
        return interviewer_message
    
    def progress_interview(self, stage: str):
        self.interview_stage = stage
        stage_prompt = f"\nNow transition to the {stage} stage of the interview."
        self.conversation_history.append({
            "role": "system",
            "content": stage_prompt
        })
    
    def generate_assessment(self) -> Dict[str, any]:
        assessment_prompt = f"""Based on the interview conversation, provide a comprehensive assessment of the candidate {self.candidate.name} for the {self.job.position_title} position.

Evaluate the following:
1. Overall Impression (1-10 score)
2. Skills Match (1-10 score)
3. Cultural Fit (1-10 score)
4. Communication Skills (1-10 score)
5. Motivation Level (1-10 score)
6. Key Strengths (3-5 points)
7. Areas of Concern (2-3 points)
8. Recommendation (Strong Yes / Yes / Maybe / No)
9. Summary (2-3 sentences)

Format the response as JSON."""

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
        
        try:
            assessment = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            assessment = {
                "raw_assessment": response.choices[0].message.content,
                "timestamp": datetime.now().isoformat()
            }
        
        return assessment
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        return [msg for msg in self.conversation_history 
                if msg["role"] != "system"]
    
    def export_interview_report(self) -> Dict:
        return {
            "interview_date": datetime.now().isoformat(),
            "candidate": asdict(self.candidate),
            "job_requirements": asdict(self.job),
            "conversation": self.get_conversation_history(),
            "assessment": self.generate_assessment(),
            "interview_stage": self.interview_stage
        }


def main():
    API_KEY = os.getenv("NVIDIA_API_KEY")
    
    if not API_KEY:
        raise ValueError("NVIDIA_API_KEY not found in environment variables")
    
    cv_file_path = "sample_cv.pdf"
    
    extractor = CVExtractor(api_key=API_KEY)
    
    print("Extracting CV information...")
    cv_text = extractor.read_cv(cv_file_path)
    candidate = extractor.extract_profile(cv_text)
    
    print(f"\nExtracted Profile for: {candidate.name}")
    print(f"Position: {candidate.current_position}")
    print(f"Experience: {candidate.years_of_experience} years")
    print(f"Skills: {', '.join(candidate.skills[:5])}...")
    
    job = JobRequirements(
        position_title="Lead Software Engineer",
        department="Engineering",
        required_skills=["Python", "React", "System Design", "Team Leadership"],
        preferred_skills=["AWS", "Docker", "Kubernetes", "Agile"],
        min_experience_years=5.0,
        job_description="Leading a team of engineers to build scalable web applications",
        salary_range="$120k-$160k",
        work_mode="Hybrid"
    )
    
    simulator = HRInterviewSimulator(api_key=API_KEY)
    simulator.initialize_interview(candidate, job)
    
    print("\n=== HR Interview Simulation ===\n")
    
    print("HR: " + simulator.ask_question())
    
    sample_responses = [
        "Thank you! I'm excited to be here. Yes, I'm very interested in the Lead Engineer position.",
        "I've been working as a Senior Software Engineer for the past 3 years, focusing on building microservices and leading small teams.",
        "I'm looking for the next step in my career where I can take on more leadership responsibilities and contribute to architectural decisions.",
    ]
    
    for response in sample_responses:
        print(f"\nCandidate: {response}")
        print(f"\nHR: {simulator.ask_question(response)}")
    
    print("\n\n=== Generating Assessment ===\n")
    assessment = simulator.generate_assessment()
    print(json.dumps(assessment, indent=2))
    
    report = simulator.export_interview_report()
    with open("interview_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("\nFull interview report saved to interview_report.json")


if __name__ == "__main__":
    main()