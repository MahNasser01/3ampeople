import { ATSApplicant, ATSStatus, ATSFilters, ATSStats, EmailTemplate } from '@/types/ats';
import { EmailServiceFactory, EmailTemplateService } from './email.service';
import { ATS_APPLICANTS, BUSINESS_INFO } from '@/lib/constants';

export class ATSService {
  private emailService: any;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.emailService = EmailServiceFactory.createService();
    this.baseUrl = baseUrl;
  }

  // Mock data for now - in production this would come from a database
  private mockApplicants: ATSApplicant[] = ATS_APPLICANTS;

  async getApplicants(filters?: ATSFilters): Promise<ATSApplicant[]> {
    let applicants = [...this.mockApplicants];

    if (filters) {
      if (filters.status) {
        applicants = applicants.filter(app => app.status === filters.status);
      }
      if (filters.scoreMin !== undefined) {
        applicants = applicants.filter(app => app.score >= filters.scoreMin!);
      }
      if (filters.scoreMax !== undefined) {
        applicants = applicants.filter(app => app.score <= filters.scoreMax!);
      }
      if (filters.position) {
        applicants = applicants.filter(app => 
          app.position.toLowerCase().includes(filters.position!.toLowerCase())
        );
      }
      if (filters.dateFrom) {
        applicants = applicants.filter(app => app.appliedAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        applicants = applicants.filter(app => app.appliedAt <= filters.dateTo!);
      }
    }

    return applicants;
  }

  async getApplicantById(id: string): Promise<ATSApplicant | null> {
    return this.mockApplicants.find(app => app.id === id) || null;
  }

  async updateApplicantStatus(id: string, status: ATSStatus): Promise<boolean> {
    const applicant = this.mockApplicants.find(app => app.id === id);
    if (applicant) {
      applicant.status = status;
      
return true;
    }
    
return false;
  }

  async sendScreeningInvite(applicantId: string): Promise<boolean> {
    const applicant = await this.getApplicantById(applicantId);
    if (!applicant) {
      return false;
    }

    // Generate interview URL
    // const interviewUrl = `${this.baseUrl}/call/${applicant.name.toLowerCase().replace(/\s+/g, '-')}-${applicant.position.toLowerCase().replace(/\s+/g, '-')}`;
    
    console.log('Sending email to:', applicant.email);
    console.log('Interview URL:', BUSINESS_INFO.interviewUrl);
    
    const emailTemplate = EmailTemplateService.generateScreeningInvite(
      applicant.name,
      BUSINESS_INFO.interviewUrl
    );

    const success = await this.emailService.sendEmail(applicant.email, emailTemplate);
    
    if (success) {
      // Update status to screening if email was sent successfully
      await this.updateApplicantStatus(applicantId, ATSStatus.SCREENING);
    }

    return success;
  }

  async getStats(): Promise<ATSStats> {
    const applicants = this.mockApplicants;
    const total = applicants.length;
    
    const stats: ATSStats = {
      total,
      new: applicants.filter(app => app.status === ATSStatus.NEW).length,
      screening: applicants.filter(app => app.status === ATSStatus.SCREENING).length,
      interview: applicants.filter(app => app.status === ATSStatus.INTERVIEW).length,
      hired: applicants.filter(app => app.status === ATSStatus.HIRED).length,
      rejected: applicants.filter(app => app.status === ATSStatus.REJECTED).length,
      averageScore: applicants.reduce((sum, app) => sum + app.score, 0) / total
    };

    return stats;
  }

  async searchApplicants(query: string): Promise<ATSApplicant[]> {
    const applicants = this.mockApplicants;
    const lowercaseQuery = query.toLowerCase();
    
    return applicants.filter(app => 
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.email.toLowerCase().includes(lowercaseQuery) ||
      app.position.toLowerCase().includes(lowercaseQuery) ||
      app.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Singleton instance - in production this would be properly managed
let atsServiceInstance: ATSService | null = null;

export const getATSService = (): ATSService => {
  if (!atsServiceInstance) {
    const baseUrl = process.env.NEXT_PUBLIC_LIVE_URL || 'http://localhost:3000';
    atsServiceInstance = new ATSService(baseUrl);
  }
  
  return atsServiceInstance;
};
