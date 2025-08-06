// import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
// import { CreateTaskDTO } from '../dto/CreateTaskDTO';
import { NotificationEntity } from '@/domain/entities/notification.entity';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryInterface,
} from '@/domain/repositories/notification-repository.interface';
import {
  EventPublisherInterface,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import { status as grpcStatus } from '@grpc/grpc-js';
import { Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateNotificationCommand } from '../command/create-notification.command';

export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: NotificationRepositoryInterface,
    @Inject(KAFKA_SERVICE)
    private readonly kafka: EventPublisherInterface,
  ) {}

  async execute(command: CreateNotificationCommand) {
    const { message, userId, type } = command;
    const notification = new NotificationEntity(message, userId, type);
    const id = await this.notificationRepo.save(notification);
    if (!id) {
      throw new RpcException({
        code: grpcStatus.INTERNAL,
        message: 'Notification creation error',
      });
    }

    await this.kafka.publish('notifications', {
      notificationId: id,
      message,
      userId,
      type,
    });

    return id;
  }
}
