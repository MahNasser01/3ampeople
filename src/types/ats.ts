export interface ATSApplicant {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedAt: Date;
  status: ATSStatus;
  score: number;
  resumeUrl?: string;
  skills: string[];
  experience: string;
  education: string;
  notes?: string;
  interviewId?: string;
}

export enum ATSStatus {
  NEW = "new",
  SCREENING = "screening",
  INTERVIEW = "interview",
  HIRED = "hired",
  REJECTED = "rejected",
}

export interface ATSScore {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  keywords: number;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  from: string;
}

export interface EmailService {
  sendEmail(to: string, template: EmailTemplate): Promise<boolean>;
}

export interface ATSFilters {
  status?: ATSStatus;
  scoreMin?: number;
  scoreMax?: number;
  position?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ATSStats {
  total: number;
  new: number;
  screening: number;
  interview: number;
  hired: number;
  rejected: number;
  averageScore: number;
}
