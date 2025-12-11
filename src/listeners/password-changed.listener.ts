import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PasswordChangedEvent } from 'src/events';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PasswordChangedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('password.changed')
  async handlePasswordChangedEvent(event: PasswordChangedEvent) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; background-color: #ffffff; }
            .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 Password Changed</h2>
            </div>
            <div class="content">
              <p>Hi <strong>${event.name}</strong>,</p>
              <p>Your password has been changed successfully.</p>
              
              <div class="alert-box">
                <strong>⚠️ Did not make this change?</strong>
                <p>If you did not request this password change, your account may be compromised. Please reset your password immediately.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${event.link}" class="button">Reset Password Now</a>
              </div>
              
              <p style="font-size: 12px; color: #6c757d;">Or copy this link: <br/>${event.link}</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.emailService.sendEmail(
        event.email,
        'Password Changed Successfully',
        `Hi ${event.name},\n\nYour password has been changed successfully. If you did not make this change, please reset your password immediately using this link: ${event.link}`,
        htmlContent,
      );
    } catch (error) {
      console.error('Failed to send password change email:', error);
    }
  }
}
