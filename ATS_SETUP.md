# ATS (Applicant Tracking System) Setup

## Overview
The ATS module provides a complete applicant tracking system with email functionality for sending screening interview invitations using Nodemailer SMTP.

## Features
- View and manage applicants with CV scores
- Send screening interview invitations via email using SMTP
- Filter and search applicants
- Real-time statistics dashboard
- Clean, maintainable email service architecture

## Email Service Configuration

### Environment Variables
Add these to your `.env.local` file:

```bash
# SMTP Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NEXT_PUBLIC_LIVE_URL=http://localhost:3000
```

### SMTP Provider Setup

#### Gmail (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use your Gmail address and the generated app password

#### Other SMTP Providers
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Configure with your provider's settings

## Usage

### Accessing the ATS
Navigate to `/dashboard/ats` in your application.

### Sending Screening Invitations
1. Find an applicant with "New" status
2. Click "Send Screening Invite" button
3. The system will:
   - Generate a unique interview URL
   - Send a professional email invitation
   - Update the applicant's status to "Screening"

### Interview URL Format
The system generates URLs in the format:
```
{baseUrl}/call/{applicant-name}-{position}
```

Example: `http://localhost:3000/call/john-smith-senior-frontend-developer`

## Architecture

### Services
- `ATSService`: Main business logic for applicant management
- `EmailService`: Abstracted email sending with multiple provider support
- `EmailTemplateService`: Professional email templates

### Types
- `ATSApplicant`: Applicant data structure
- `ATSStatus`: Application status enum
- `EmailTemplate`: Email template structure

### Components
- `ATSPage`: Main dashboard component
- `Badge`: Status indicators
- `Input`: Search functionality

## Customization

### Email Templates
Modify `EmailTemplateService.generateScreeningInvite()` to customize email content.

### SMTP Configuration Details
- **SMTP_HOST**: Your SMTP server hostname
- **SMTP_PORT**: Port number (usually 587 for TLS, 465 for SSL)
- **SMTP_SECURE**: Set to `true` for SSL (port 465), `false` for TLS (port 587)
- **SMTP_USER**: Your email address
- **SMTP_PASS**: Your email password or app-specific password

### Mock Data
The current implementation uses mock data. To connect to a real database:
1. Replace mock data in `ATSService.getApplicants()`
2. Implement proper database queries
3. Add database models for applicants

## Future Enhancements
- Database integration
- File upload for CVs
- Advanced scoring algorithms
- Interview scheduling
- Analytics and reporting
- Bulk operations
