// notifications-status.consumer.ts

import { UpdateStatusNotificationUseCase } from '@/application/usecases/update-status-notification.use-case';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationStatusDto } from './dto/notification-status.dto';

@Controller()
export class NotificationStatusConsumer {
  private readonly logger = new Logger(NotificationStatusConsumer.name);

  constructor(
    private readonly updateStatusNotificationUseCase: UpdateStatusNotificationUseCase,
  ) {}

  @MessagePattern('notifications.status')
  async handleStatus(@Payload() message: NotificationStatusDto) {
    const { notificationId, status } = message;

    this.logger.log(
      `🧩 Received notification ${notificationId} (status: ${status})`,
    );

    await this.updateStatusNotificationUseCase.execute({
      notificationId,
      status,
    });
  }
}
