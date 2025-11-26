import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Interview,
  InterviewDetail,
  Job,
  CreateInterviewData,
  InterviewMessage,
  InterviewResponse,
  StartInterviewResponse,
} from '../types';

// Use relative URL in production (nginx proxies to backend)
// Use localhost:8000 in development
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Candidate endpoints
  async getCandidateProfile(): Promise<User> {
    return this.request<User>('/candidate/profile');
  }

  async updateCandidateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/candidate/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getCandidateInterviews(): Promise<Interview[]> {
    return this.request<Interview[]>('/candidate/interviews');
  }

  async createInterview(data: CreateInterviewData): Promise<Interview> {
    return this.request<Interview>('/candidate/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCandidateInterview(interviewId: number): Promise<Interview> {
    return this.request<Interview>(`/candidate/interviews/${interviewId}`);
  }

  // Interview (AI) endpoints
  async startInterview(interviewId: number): Promise<StartInterviewResponse> {
    return this.request<StartInterviewResponse>(`/interview/start/${interviewId}`, {
      method: 'POST',
    });
  }

  async sendInterviewMessage(
    interviewId: number,
    message: InterviewMessage
  ): Promise<InterviewResponse> {
    return this.request<InterviewResponse>(`/interview/message/${interviewId}`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getInterviewResult(interviewId: number): Promise<InterviewDetail> {
    return this.request<InterviewDetail>(`/interview/result/${interviewId}`);
  }

  async uploadCV(file: File): Promise<{ message: string; profile: any }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/interview/upload-cv`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  }

  // Recruiter endpoints
  async getRecruiterCandidates(minScore: number = 0): Promise<Interview[]> {
    return this.request<Interview[]>(`/recruiter/candidates?min_score=${minScore}`);
  }

  async getRecruiterInterviews(status?: string): Promise<Interview[]> {
    const query = status ? `?status_filter=${status}` : '';
    return this.request<Interview[]>(`/recruiter/interviews${query}`);
  }

  async getRecruiterInterviewDetails(interviewId: number): Promise<any> {
    return this.request<any>(`/recruiter/interviews/${interviewId}`);
  }

  async getRecruiterStats(): Promise<{
    total_interviews: number;
    completed_interviews: number;
    pending_interviews: number;
    high_scorers: number;
  }> {
    return this.request(`/recruiter/stats`);
  }

  // Jobs endpoints
  async getJobs(activeOnly: boolean = true): Promise<Job[]> {
    return this.request<Job[]>(`/jobs?active_only=${activeOnly}`);
  }

  async getJob(jobId: number): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`);
  }

  async createJob(data: Omit<Job, 'id' | 'created_at' | 'is_active'>): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(jobId: number, data: Partial<Job>): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(jobId: number): Promise<void> {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
