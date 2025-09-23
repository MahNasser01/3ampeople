import {
  ATSApplicant,
  ATSStatus,
  ATSFilters,
  ATSStats,
  EmailTemplate,
} from "@/types/ats";
import { EmailServiceFactory, EmailTemplateService } from "./email.service";
import { ATS_APPLICANTS, BUSINESS_INFO } from "@/lib/constants";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Interface for the API response from get-applications endpoint
interface ApplicantData {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  job_position: string;
  cover_letter: string;
  resume_url: string;
  parsed_resume: string;
  analyzed_resume: {
    skills: string[];
    summary: string;
    projects: Array<{
      name: string;
      tech: string[];
      description: string;
    }>;
    education: Array<{
      start: string;
      end: string;
      degree: string;
      institution: string;
    }>;
    experience: Array<{
      start: string;
      end: string;
      role: string;
      company: string;
      details: string[];
    }>;
    certifications: string[];
  };
  resume_score: number;
  interview_id: string;
  status: ATSStatus;
}

export class ATSService {
  private emailService: any;
  private baseUrl: string;
  private supabase: any;

  constructor(baseUrl: string) {
    this.emailService = EmailServiceFactory.createService();
    this.baseUrl = baseUrl;
    this.supabase = createClientComponentClient();
  }

  /**
   * Transform API applicant data to ATSApplicant format
   */
  private transformApplicantData(applicant: ApplicantData): ATSApplicant {
    const experience = this.extractExperienceLevel(
      applicant.analyzed_resume.experience,
    );
    const education = this.extractEducationLevel(
      applicant.analyzed_resume.education,
    );

    return {
      id: applicant.id.toString(),
      name: applicant.full_name,
      email: applicant.email,
      position: applicant.job_position,
      appliedAt: new Date(applicant.created_at),
      status: applicant.status, // Use the status from the API response
      score: Math.round(applicant.resume_score * 100), // Convert to 0-100 scale
      resumeUrl: applicant.resume_url,
      skills: applicant.analyzed_resume.skills.slice(0, 5), // Limit to 5 skills
      experience,
      education,
      notes: applicant.cover_letter || applicant.analyzed_resume.summary,
      interviewId: applicant.interview_id,
    };
  }

  /**
   * Extract experience level from work experience data
   */
  private extractExperienceLevel(
    experience: ApplicantData["analyzed_resume"]["experience"],
  ): string {
    if (!experience || experience.length === 0) {
      return "0-2 years";
    }

    // Calculate total years of experience
    let totalYears = 0;
    experience.forEach((exp) => {
      const startYear = new Date(exp.start).getFullYear();
      const endYear =
        exp.end === "Current"
          ? new Date().getFullYear()
          : new Date(exp.end).getFullYear();
      totalYears += endYear - startYear;
    });

    if (totalYears >= 5) {
      return "5+ years";
    } else if (totalYears >= 3) {
      return "3-5 years";
    } else if (totalYears >= 1) {
      return "1-3 years";
    } else {
      return "0-2 years";
    }
  }

  /**
   * Extract education level from education data
   */
  private extractEducationLevel(
    education: ApplicantData["analyzed_resume"]["education"],
  ): string {
    if (!education || education.length === 0) {
      return "High School";
    }

    // Find the highest degree
    const degrees = education.map((edu) => edu.degree.toLowerCase());

    if (
      degrees.some(
        (degree) => degree.includes("phd") || degree.includes("doctorate"),
      )
    ) {
      return "PhD";
    } else if (
      degrees.some(
        (degree) => degree.includes("master") || degree.includes("mba"),
      )
    ) {
      return "Master's Degree";
    } else if (
      degrees.some(
        (degree) =>
          degree.includes("bachelor") ||
          degree.includes("beng") ||
          degree.includes("meng"),
      )
    ) {
      return "Bachelor's Degree";
    } else if (
      degrees.some(
        (degree) => degree.includes("associate") || degree.includes("diploma"),
      )
    ) {
      return "Associate Degree";
    } else {
      return "High School";
    }
  }

  /**
   * Get interview url by interview ID from database
   */
  private async getInterviewURL(interviewId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from("interview")
        .select("url")
        .eq("id", interviewId)
        .single();

      if (error) {
        console.error("Error fetching interview name:", error);
        return null;
      }

      return data?.url || null;
    } catch (error) {
      console.error("Error getting interview name:", error);
      return null;
    }
  }

  /**
   * Fetch applicants from API
   */
  private async fetchApplicantsFromAPI(): Promise<ATSApplicant[]> {
    try {
      const apiUrl = this.baseUrl.startsWith("http")
        ? `${this.baseUrl}/api/get-applications`
        : `http://${this.baseUrl}/api/get-applications`;

      // Add cache-busting parameter to ensure fresh data
      const cacheBuster = `?t=${Date.now()}`;
      const urlWithCacheBuster = `${apiUrl}${cacheBuster}`;

      const response = await fetch(urlWithCacheBuster, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const applicants: ApplicantData[] = await response.json();

      return applicants.map((applicant) =>
        this.transformApplicantData(applicant),
      );
    } catch (error) {
      console.error("Error fetching applicants from API:", error);
      // Fallback to mock data if API fails

      return ATS_APPLICANTS;
    }
  }

  async getApplicants(filters?: ATSFilters): Promise<ATSApplicant[]> {
    // Fetch applicants from API instead of using mock data
    let applicants = await this.fetchApplicantsFromAPI();

    if (filters) {
      if (filters.status) {
        applicants = applicants.filter((app) => app.status === filters.status);
      }
      if (filters.scoreMin !== undefined) {
        applicants = applicants.filter((app) => app.score >= filters.scoreMin!);
      }
      if (filters.scoreMax !== undefined) {
        applicants = applicants.filter((app) => app.score <= filters.scoreMax!);
      }
      if (filters.position) {
        applicants = applicants.filter((app) =>
          app.position.toLowerCase().includes(filters.position!.toLowerCase()),
        );
      }
      if (filters.dateFrom) {
        applicants = applicants.filter(
          (app) => app.appliedAt >= filters.dateFrom!,
        );
      }
      if (filters.dateTo) {
        applicants = applicants.filter(
          (app) => app.appliedAt <= filters.dateTo!,
        );
      }
    }

    return applicants;
  }

  async getApplicantById(id: string): Promise<ATSApplicant | null> {
    const applicants = await this.fetchApplicantsFromAPI();

    return applicants.find((app) => app.id === id) || null;
  }

  async updateApplicantStatus(id: string, status: ATSStatus): Promise<boolean> {
    try {
      console.log(`Attempting to update applicant ${id} status to ${status}`);

      const response = await fetch(
        `${this.baseUrl}/api/update-application-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId: id,
            status: status,
          }),
        },
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to update application status:",
          response.status,
          errorText,
        );
        return false;
      }

      const updatedApplication = await response.json();
      console.log(
        `Successfully updated applicant ${id} status to ${status}:`,
        updatedApplication,
      );
      return true;
    } catch (error) {
      console.error("Error updating application status:", error);
      return false;
    }
  }

  async sendScreeningInvite(applicantId: string): Promise<boolean> {
    const applicant = await this.getApplicantById(applicantId);
    if (!applicant) {
      return false;
    }

    // Get the actual interview ID from the applicant data
    const interviewId = applicant.interviewId;

    if (!interviewId) {
      console.warn(
        "No interview ID found for applicant, skipping question generation",
      );
    }

    try {
      // Generate tailored questions for the screening interview
      const generateQuestionsResponse = await fetch(
        `${this.baseUrl}/api/generate-screening-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantId,
            userEmail: applicant.email,
            interviewId: interviewId,
            numberOfQuestions: 3,
          }),
        },
      );

      if (!generateQuestionsResponse.ok) {
        console.warn(
          "Failed to generate tailored questions, proceeding with email send",
        );
      } else {
        const questionsResult = await generateQuestionsResponse.json();
        console.log("Generated tailored questions:", questionsResult);
      }
    } catch (error) {
      console.warn("Error generating tailored questions:", error);
      // Continue with email sending even if question generation fails
    }

    // Get interview name to construct the proper URL
    let interviewUrl: string | null = null;
    if (applicant.interviewId) {
      interviewUrl = await this.getInterviewURL(applicant.interviewId);
    }

    const emailTemplate = EmailTemplateService.generateScreeningInvite(
      applicant.name,
      interviewUrl || "",
    );

    const success = await this.emailService.sendEmail(
      applicant.email,
      emailTemplate,
    );

    if (success) {
      // Update status to screening if email was sent successfully
      await this.updateApplicantStatus(applicantId, ATSStatus.SCREENING);
    }

    return success;
  }

  async getStats(): Promise<ATSStats> {
    const applicants = await this.fetchApplicantsFromAPI();
    const total = applicants.length;

    const stats: ATSStats = {
      total,
      new: applicants.filter((app) => app.status === ATSStatus.NEW).length,
      screening: applicants.filter((app) => app.status === ATSStatus.SCREENING)
        .length,
      interview: applicants.filter((app) => app.status === ATSStatus.INTERVIEW)
        .length,
      hired: applicants.filter((app) => app.status === ATSStatus.HIRED).length,
      rejected: applicants.filter((app) => app.status === ATSStatus.REJECTED)
        .length,
      averageScore:
        total > 0
          ? applicants.reduce((sum, app) => sum + app.score, 0) / total
          : 0,
    };

    return stats;
  }

  async searchApplicants(query: string): Promise<ATSApplicant[]> {
    const applicants = await this.fetchApplicantsFromAPI();
    const lowercaseQuery = query.toLowerCase();

    return applicants.filter(
      (app) =>
        app.name.toLowerCase().includes(lowercaseQuery) ||
        app.email.toLowerCase().includes(lowercaseQuery) ||
        app.position.toLowerCase().includes(lowercaseQuery) ||
        app.skills.some((skill) =>
          skill.toLowerCase().includes(lowercaseQuery),
        ),
    );
  }
}

// Singleton instance - in production this would be properly managed
let atsServiceInstance: ATSService | null = null;

export const getATSService = (): ATSService => {
  if (!atsServiceInstance) {
    // Use window.location.origin for client-side requests or fallback to localhost
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000";
    atsServiceInstance = new ATSService(baseUrl);
  }

  return atsServiceInstance;
};
