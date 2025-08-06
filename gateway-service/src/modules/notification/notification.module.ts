// auth.module.ts
import {
  REDIS_CLIENT_SERVICE,
  RedisClientService,
} from '@/common/services/redis.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationController } from './notification.controller';
import {
  NOTIFICATION_SERVICE,
  NotificationServiceClient,
} from './notification.service.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'notification',
            protoPath: join(process.cwd(), 'proto/notification.proto'),
            url:
              configService.get<string>('NOTIFICATION_GRPC_URL') ||
              '0.0.0.0:3002',
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationServiceClient,
    {
      provide: REDIS_CLIENT_SERVICE,
      useClass: RedisClientService,
    },
  ],
  exports: [],
})
export class NotificationModule {}
