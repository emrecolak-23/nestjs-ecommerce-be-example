import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationPayload } from './interfaces/notification.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async sendNotification(payload: NotificationPayload) {
    console.log(payload, 'notify payload');
    const notification = this.notificationRepository.create({
      type: payload.type,
      message: payload.message,
    });
    const storedNotification = await this.notificationRepository.save(notification);
    this.notificationGateway.sendNotification(storedNotification);
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
      },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return notification;
  }

  async findAll() {
    return this.notificationRepository.find();
  }
}
