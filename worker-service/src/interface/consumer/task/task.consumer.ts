import { ProcessTaskInputUseCase } from '@/application/usecases/process-task-input.use-case';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskInputDto } from './dto/task-input.dto';

@Controller()
export class TaskConsumer {
  private readonly logger = new Logger(TaskConsumer.name);

  constructor(private readonly processTaskUsecase: ProcessTaskInputUseCase) {}

  @MessagePattern('tasks-input')
  async handleTask(@Payload() message: TaskInputDto) {
    const { taskId, payload, priority } = message;
    this.logger.log(`🧩 Received task ${taskId} (priority: ${priority})`);

    try {
      await this.processTaskUsecase.execute({
        taskId: taskId,
        payload: payload,
      });
    } catch (err) {
      this.logger.error(`❌ Failed to process task ${taskId}`, err);
    }
  }
}
