import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from '@/domain/repositories/notification-repository.interface';
import { status as grpcStatus } from '@grpc/grpc-js';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class GetByIdNotificationUseCase {
  private readonly logger = new Logger(GetByIdNotificationUseCase.name);
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
  ) {}

  async execute(id: string) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) {
      this.logger.log(`Getting notification with ${id}`);
      throw new RpcException({
        code: grpcStatus.INTERNAL,
        message: 'Notification get error',
      });
    }

    return notification.status;
  }
}
