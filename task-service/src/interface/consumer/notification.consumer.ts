import { ProcessTaskOutputUseCase } from '@/application/usecases/process-task-output.use-case';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskOutputDto } from './dto/task-input.dto';

@Controller()
export class TaskConsumer {
  private readonly logger = new Logger(TaskConsumer.name);

  constructor(private readonly processTaskUsecase: ProcessTaskOutputUseCase) {}

  @MessagePattern('tasks-output')
  async handleTask(@Payload() message: TaskOutputDto) {
    const { taskId, result, processedAt } = message;
    this.logger.log(`🧩 Received task-output ${taskId} (result: ${result})`);

    try {
      await this.processTaskUsecase.execute({ taskId, result, processedAt });
    } catch (err) {
      this.logger.error(`❌ Failed to process task ${taskId}`, err);
    }
  }
}
