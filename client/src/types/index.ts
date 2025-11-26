export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER' | 'ROLE_ADMIN';
  info?: string;
  cv?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Interview {
  id: number;
  user_id: number;
  position: string;
  company?: string;
  score: number;
  status: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
  completed_at?: string;
  candidate_name?: string;
  candidate_email?: string;
}

export interface InterviewDetail extends Interview {
  conversation?: ConversationMessage[];
  assessment?: Assessment;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Assessment {
  overall_score: number;
  skills_match: number;
  cultural_fit: number;
  communication: number;
  motivation: number;
  experience_relevance: number;
  strengths: string[];
  concerns: string[];
  recommendation: string;
  summary: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number;
  salary_range?: string;
  work_mode: string;
  is_active: number;
  created_at?: string;
}

export interface CreateInterviewData {
  position: string;
  company?: string;
}

export interface InterviewMessage {
  message: string;
}

export interface InterviewResponse {
  interviewer_message: string;
  is_complete: boolean;
}

export interface StartInterviewResponse {
  interview_id: number;
  status: string;
  interviewer_message: string;
  is_complete: boolean;
}
