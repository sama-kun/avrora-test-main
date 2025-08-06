import { REDIS_CLIENT_SERVICE } from '@/domain/services/redis.interface';
import { RedisClientService } from '@/infrastructure/redis/redis.service';
import { KafkaModule } from '@/interface/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { NotificationConsumer } from './notification.consumer';
@Module({
  imports: [KafkaModule],
  controllers: [NotificationConsumer],
  providers: [
    {
      provide: REDIS_CLIENT_SERVICE,
      useClass: RedisClientService,
    },
  ],
})
export class NotificationConsumerModule {}
