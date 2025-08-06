// application/use-cases/process-task.use-case.ts
import { TaskEntity } from '@/domain/entities/task/task.entity';
import {
  EventPublisherInterface,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProcessTaskCommand } from '../command/process-task.command';

@Injectable()
export class ProcessTaskInputUseCase {
  private readonly logger = new Logger(ProcessTaskInputUseCase.name);

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafka: EventPublisherInterface,
  ) {}

  async execute(command: ProcessTaskCommand) {
    const { taskId, payload } = command;
    const task = new TaskEntity(taskId, payload);
    const { result, processedAt } = task.process();

    await this.kafka.publish('tasks-output', { taskId, result, processedAt });
    this.logger.log(
      `✅ Task ${taskId} processed and published to tasks-output`,
    );
  }
}
