import { CreateNotificationUseCase } from '@/application/usecases/create-notification.use-case';
import { GetByIdNotificationUseCase } from '@/application/usecases/get-notification-by-id.use-case';
import { UpdateStatusNotificationUseCase } from '@/application/usecases/update-status-notification.use-case';
import { NOTIFICATION_REPOSITORY } from '@/domain/repositories/notification-repository.interface';
import { REDIS_CLIENT_SERVICE } from '@/domain/services/redis.interface';
import { NotificationPgRepository } from '@/infrastructure/repositories/notification.pg.repository';
import { PostgresService } from '@/infrastructure/services/postgres.service';
import { RedisClientService } from '@/infrastructure/services/redis.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '../kafka/kafka.module';
import { TaskController } from './notification.controller';

@Module({
  imports: [KafkaModule],
  controllers: [TaskController],
  providers: [
    ConfigModule,
    PostgresService,
    {
      provide: NOTIFICATION_REPOSITORY,
      useFactory: (postgresService: PostgresService) => {
        return new NotificationPgRepository(postgresService);
      },
      inject: [PostgresService],
    },
    {
      provide: REDIS_CLIENT_SERVICE,
      useClass: RedisClientService,
    },
    CreateNotificationUseCase,
    UpdateStatusNotificationUseCase,
    GetByIdNotificationUseCase,
  ],
  exports: [CreateNotificationUseCase, UpdateStatusNotificationUseCase],
})
export class NotificationModule {}
