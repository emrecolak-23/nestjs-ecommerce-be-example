import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async sendNotification(message: string) {
    console.log(message, 'notify message');
    this.notificationGateway.sendNotification(message);
  }
}
