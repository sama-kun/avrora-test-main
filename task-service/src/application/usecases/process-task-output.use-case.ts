import {
  TASK_REPOSITORY,
  TaskRepositoryInterface,
} from '@/domain/repositories/task-repository.interface';
import {
  REDIS_CLIENT_SERVICE,
  RedisClientServiceInterface,
} from '@/domain/services/redis.interface';
import { Inject, Logger } from '@nestjs/common';
import { ProcessTaskOutputCommand } from '../command/process-task-output.use-case';

export class ProcessTaskOutputUseCase {
  private readonly logger = new Logger(ProcessTaskOutputUseCase.name);

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryInterface,
    @Inject(REDIS_CLIENT_SERVICE)
    private readonly redis: RedisClientServiceInterface,
  ) {}

  async execute(command: ProcessTaskOutputCommand) {
    const { taskId, result, processedAt } = command;

    try {
      const task = await this.taskRepo.findById(taskId);

      if (!task) {
        this.logger.error(`Task with id ${taskId} not found`);
      }

      task.markDone(result, new Date(processedAt));

      await this.taskRepo.update(task);

      const key = `task:result:${taskId}`;
      const value = JSON.stringify(task);
      this.redis.set(key, value, 3600);

      return task;
    } catch (error) {
      this.logger.error(error.message || 'Failed to process task');
    }
  }
}
