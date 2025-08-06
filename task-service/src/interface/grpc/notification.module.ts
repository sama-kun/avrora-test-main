import { CreateTaskUseCase } from '@/application/usecases/create-task.use-case';
import { GetTaskByIdUseCase } from '@/application/usecases/get-task-by-id.use-case';
import { ProcessTaskOutputUseCase } from '@/application/usecases/process-task-output.use-case';
import { TASK_REPOSITORY } from '@/domain/repositories/task-repository.interface';
import { REDIS_CLIENT_SERVICE } from '@/domain/services/redis.interface';
import { TaskPgRepository } from '@/infrastructure/repositories/task.pg.repository';
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
      provide: TASK_REPOSITORY,
      useFactory: (postgresService: PostgresService) => {
        return new TaskPgRepository(postgresService);
      },
      inject: [PostgresService],
    },
    {
      provide: REDIS_CLIENT_SERVICE,
      useClass: RedisClientService,
    },
    CreateTaskUseCase,
    ProcessTaskOutputUseCase,
    GetTaskByIdUseCase,
  ],
  exports: [ProcessTaskOutputUseCase],
})
export class TaskModule {}
