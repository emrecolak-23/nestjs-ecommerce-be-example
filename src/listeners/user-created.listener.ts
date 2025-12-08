import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/events';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    try {
      await this.emailService.sendEmail(
        event.email,
        'Welcome to Our Platform!',
        `Hi ${event.name},\n\nWelcome to our e-commerce platform! We're excited to have you on board.`,
        `<h2>Welcome to Our Platform!</h2><p>Hi <b>${event.name}</b>,</p><p>We're excited to have you on board!</p>`,
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}
