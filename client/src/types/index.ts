export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ROLE_CANDIDATE' | 'ROLE_RECRUITER';
  info?: string;
  cv?: string;
  two_factor_enabled?: boolean;
  totp_confirmed?: boolean;
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

// 2FA Response Types
export interface TwoFactorLoginResponse {
  requires_2fa: true;
  session_token: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  requires_2fa?: boolean;
  session_token?: string;
  email?: string;
  message?: string;
  access_token?: string;
  token_type?: string;
  user?: User;
}

export interface TwoFactorVerifyRequest {
  session_token: string;
  code: string;
}

export interface TwoFactorResendResponse {
  message: string;
  email: string;
}

export interface Toggle2FAResponse {
  two_factor_enabled: boolean;
  message: string;
}

// TOTP (Google Authenticator) Types
export interface TOTPSetupResponse {
  secret: string;
  qr_code: string;  // Base64 encoded QR code image
  otpauth_url: string;
}

export interface TOTPVerifyRequest {
  code: string;
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
