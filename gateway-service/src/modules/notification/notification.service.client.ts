// src/api-gateway/user/user.service.client.ts
import {
  REDIS_CLIENT_SERVICE,
  RedisClientServiceInterface,
} from '@/common/services/redis.service';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { GetNotificationByIdDto } from './dtos/get-notification-by-id.dto';

export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';

interface NotificationServiceInterface {
  createNotification(data: CreateNotificationDto): Observable<{ id: string }>;
  getNotificationById(
    data: GetNotificationByIdDto,
  ): Observable<{ status: string }>;
}

@Injectable()
export class NotificationServiceClient implements OnModuleInit {
  private notificationService: NotificationServiceInterface;

  private readonly logger = new Logger(NotificationServiceClient.name);

  constructor(
    @Inject(NOTIFICATION_SERVICE) private client: ClientGrpc,
    @Inject(REDIS_CLIENT_SERVICE)
    private readonly redis: RedisClientServiceInterface,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.client.getService<NotificationServiceInterface>(
        'NotificationService',
      );
  }

  createNotification(data: CreateNotificationDto) {
    return this.notificationService.createNotification(data);
  }

  async getNotificationById(id: string) {
    return this.notificationService.getNotificationById({ id });
  }
}
