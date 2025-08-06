// import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
// import { CreateTaskDTO } from '../dto/CreateTaskDTO';
import { TaskEntity } from '@/domain/entities/task.entity';
import {
  TASK_REPOSITORY,
  TaskRepositoryInterface,
} from '@/domain/repositories/task-repository.interface';
import {
  EventPublisherInterface,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import { Inject } from '@nestjs/common';
import { CreateTaskCommand } from '../command/create-task.command';

export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryInterface,
    @Inject(KAFKA_SERVICE)
    private readonly kafka: EventPublisherInterface,
  ) {}

  async execute(command: CreateTaskCommand) {
    const task = new TaskEntity(command.payload, command.priority);
    await this.taskRepo.save(task);
    await this.kafka.publish('tasks-input', {
      taskId: task.id,
      payload: task.payload,
      priority: task.priority,
    });

    task.markProcessing();

    this.taskRepo.update(task);
    return task.id;
  }
}
