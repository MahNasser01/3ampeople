import { BUSINESS_INFO } from '@/lib/constants';
import { EmailService, EmailTemplate } from '@/types/ats';

// Client-side email service that calls the API route
export class ClientEmailService implements EmailService {
  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          template
        }),
      });

      const result = await response.json();
      
return result.success;
    } catch (error) {
      console.error('Email API error:', error);
      
return false;
    }
  }
}

// Email service factory - simplified for client-side API calls
export class EmailServiceFactory {
  static createService(): ClientEmailService {
    return new ClientEmailService();
  }
}

// Email template service
export class EmailTemplateService {
  static generateScreeningInvite(
    applicantName: string,
    interviewUrl: string,
  ): EmailTemplate {
    return {
      from: `${BUSINESS_INFO.email}`,
      subject: `Screening Interview Invitation - ${BUSINESS_INFO.name}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${applicantName}!</h2>
          
          <p>Thank you for your interest in joining our team. We're excited to move forward with your application!</p>
          
          <p>We'd like to invite you to participate in our initial screening interview. This is a quick, automated interview that will help us get to know you better.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">Next Steps:</h3>
            <ol>
              <li>Click the link below to start your screening interview</li>
              <li>Complete the interview at your convenience</li>
              <li>We'll review your responses and get back to you soon</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${interviewUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; cursor: pointer;">
              Start Screening Interview
            </a>
          </div>
          
          <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              If the button above doesn't work, copy and paste this link into your browser:
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #007bff; word-break: break-all;">
              ${interviewUrl}
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px;">
            This interview should take approximately 15-20 minutes to complete.
          </p>
          
          <p>If you have any questions, please don't hesitate to reach out to us.</p>
          
          <p>Best regards,<br>
          The ${BUSINESS_INFO.name} Team</p>
        </div>
      `,
    };
  }
}
