# Nodemailer SMTP Setup Guide

## Quick Setup

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NEXT_PUBLIC_LIVE_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to Google Account → Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Select "Mail" and generate a password
   - Use this password (not your regular Gmail password)

3. **Configure Environment**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### 3. Other Email Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/dashboard/ats`
3. Use the "Email Service Test" component at the bottom
4. Enter a test email address
5. Click "Send Test Email"

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your email and password
   - For Gmail, make sure you're using an App Password, not your regular password
   - Ensure 2FA is enabled for Gmail

2. **Connection Timeout**
   - Check your SMTP_HOST and SMTP_PORT
   - Try different ports (587 for TLS, 465 for SSL)
   - Check firewall settings

3. **SSL/TLS Errors**
   - Set SMTP_SECURE=true for port 465 (SSL)
   - Set SMTP_SECURE=false for port 587 (TLS)

### Debug Mode

Add this to your environment to see detailed logs:
```bash
NODE_ENV=development
```

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of your main email password
- Consider using environment-specific configurations for production
