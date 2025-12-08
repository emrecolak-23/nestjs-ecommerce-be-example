import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/events';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    try {
      await this.emailService.sendEmail(
        event.userEmail,
        `Order Confirmation #${event.orderId}`,
        `Your order #${event.orderId} has been confirmed. Total: $${event.totalPrice}`,
        `<b>Order Confirmation</b><br/>Order ID: ${event.orderId}<br/>Total Price: $${event.totalPrice}`,
      );
    } catch (error) {
      console.error('Failed to send order email:', error);
    }
  }
}
