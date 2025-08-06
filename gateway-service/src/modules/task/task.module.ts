// auth.module.ts
import {
  REDIS_CLIENT_SERVICE,
  RedisClientService,
} from '@/common/services/redis.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TaskController } from './task.controller';
import { TASK_SERVICE, TaskServiceClient } from './task.service.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TASK_SERVICE,
        imports: [ConfigModule], // обязательно импортировать
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'task',
            protoPath: join(process.cwd(), 'proto/task.proto'),
            url: configService.get<string>('TASK_GRPC_URL') || '0.0.0.0:3001',
          },
        }),
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [
    TaskServiceClient,
    {
      provide: REDIS_CLIENT_SERVICE,
      useClass: RedisClientService,
    },
  ],
  exports: [],
})
export class TaskModule {}
