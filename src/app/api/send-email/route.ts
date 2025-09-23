import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, template } = await request.json();

    // SMTP configuration from environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    };

    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Send email
    const result = await transporter.sendMail({
      from: template.from,
      to: to,
      subject: template.subject,
      html: template.body,
    });

    console.log('Email sent successfully:', result.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
