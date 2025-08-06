import { NotificationStatusEnum } from '@/domain/entities/notification/notification-status.enum';
import {
  EventPublisherInterface,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import {
  REDIS_CLIENT_SERVICE,
  RedisClientServiceInterface,
} from '@/domain/services/redis.interface';
import { Controller, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationInputDto } from './dto/notification-input.dto';

@Controller()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    @Inject(REDIS_CLIENT_SERVICE)
    private readonly redisService: RedisClientServiceInterface,
    @Inject(KAFKA_SERVICE)
    private readonly kafkaPublisher: EventPublisherInterface,
  ) {}

  @MessagePattern('notifications')
  async handleNotification(@Payload() messageFromKafka: NotificationInputDto) {
    const { notificationId, userId } = messageFromKafka;
    this.logger.log(
      `📨 Received notification ${notificationId} (userId: ${userId})`,
    );

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      this.logger.log(`📤 Sending notification (attempt ${attempt})`);

      await new Promise((res) => setTimeout(res, 1000));

      const ackKey = `notification:ack:${notificationId}`;
      await this.redisService.set(ackKey, 'ack', 300);

      await new Promise((res) => setTimeout(res, 2000));

      const ackExists = await this.redisService.exists(ackKey);
      if (ackExists) {
        this.logger.log(`✅ Notification ${notificationId} delivered`);
        await this.kafkaPublisher.publish('notifications.status', {
          notificationId: notificationId,
          status: NotificationStatusEnum.SENT,
        });
        return;
      }

      this.logger.warn(`⚠️ No ACK for ${notificationId} on attempt ${attempt}`);
    }

    // Все попытки неудачны
    this.logger.error(`❌ Failed to deliver notification ${notificationId}`);
    await this.kafkaPublisher.publish('notifications.status', {
      notificationId: notificationId,
      status: NotificationStatusEnum.FAILED,
    });
  }
}
