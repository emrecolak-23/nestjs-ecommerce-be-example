import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name, {
    timestamp: true,
  });

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from: 'noreply@nestjs.com',
      subject,
      text,
      html,
    });

    this.logger.log(`Sent email to ${to} with subject: ${subject}`);
  }
}
