import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cremy.co';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn('Email: SMTP not configured, emails will be logged only');
        this.transporter = nodemailer.createTransport({
          host: 'localhost',
          port: 25,
          ignoreTLS: true,
        });
      } else {
        this.transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT, 10),
          secure: SMTP_PORT === '465',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });
      }
    }
    return this.transporter;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const transporter = this.getTransporter();

    const info = await transporter.sendMail({
      from: `"Cremy Docs" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email] Sent to ${options.to}: ${info.messageId}`);
      console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Verify your email - Cremy Docs',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Cremy Docs, ${name}!</h1>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #0070f3; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link: ${verifyUrl}</p>
          <p>This link expires in 24 hours.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Reset your password - Cremy Docs',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #0070f3; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link: ${resetUrl}</p>
          <p>This link expires in 1 hour.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email or contact support.</p>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
export default emailService;