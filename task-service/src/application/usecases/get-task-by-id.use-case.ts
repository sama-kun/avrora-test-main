import {
  TASK_REPOSITORY,
  TaskRepositoryInterface,
} from '@/domain/repositories/task-repository.interface';
import {
  REDIS_CLIENT_SERVICE,
  RedisClientServiceInterface,
} from '@/domain/services/redis.interface';
import { status as grpcStatus } from '@grpc/grpc-js';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class GetTaskByIdUseCase {
  private readonly logger = new Logger(GetTaskByIdUseCase.name);
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryInterface,
    @Inject(REDIS_CLIENT_SERVICE)
    private readonly redis: RedisClientServiceInterface,
  ) {}

  async execute(id: string) {
    const key = `task:result:${id}`;
    const task = await this.taskRepo.findById(id);

    if (!task) {
      throw new RpcException({
        code: grpcStatus.NOT_FOUND,
        message: `Task with id "${id}" not found`,
      });
    }

    await this.redis.set(key, JSON.stringify(task), 3600);

    return task;
  }
}
