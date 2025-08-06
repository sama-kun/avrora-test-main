// import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
// import { CreateTaskDTO } from '../dto/CreateTaskDTO';
import { NotificationStatusEnum } from '@/domain/entities/notification-status.enum';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from '@/domain/repositories/notification-repository.interface';
import {
  EventPublisherInterface,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import { Inject, Logger } from '@nestjs/common';
import { UpdateNotificationCommand } from '../command/update-task-output.use-case';

export class UpdateStatusNotificationUseCase {
  private readonly logger = new Logger(UpdateStatusNotificationUseCase.name);
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
    @Inject(KAFKA_SERVICE)
    private readonly kafka: EventPublisherInterface,
  ) {}

  async execute(command: UpdateNotificationCommand) {
    const { status, notificationId } = command;
    const candidate = await this.notificationRepo.findById(notificationId);

    if (!candidate) {
      this.logger.error(`Notification with ID: ${notificationId} not found`);
    }

    switch (status) {
      case NotificationStatusEnum.SENT:
        this.logger.log(`✅ Notification ${notificationId} was sent`);
        candidate.markSent();
        break;

      case NotificationStatusEnum.FAILED:
        this.logger.warn(`❌ Notification ${notificationId} delivery failed`);
        candidate.markFailed();
        break;

      default:
        this.logger.warn(
          `ℹ️ Unknown status ${status} for notification ${notificationId}`,
        );
    }
    const notification = await this.notificationRepo.update(candidate);
    if (!notification) {
      this.logger.error(`Error updating notification ID: ${notificationId}`);
    }
  }
}
