import { CreateTaskUseCase } from '@/application/usecases/create-task.use-case';
import { GetTaskByIdUseCase } from '@/application/usecases/get-task-by-id.use-case';
import { CreateTaskDto } from '@/interface/grpc/dto/create-task.dto';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetTaskByIdDto } from './dto/get-task-by-id.dto';
import { TaskMapper } from './notification.mapper';

@Controller()
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
  ) {}

  @GrpcMethod('TaskService', 'CreateTask')
  async createTask(dto: CreateTaskDto) {
    const command = TaskMapper.toCreateTaskCommand(dto);

    const res = await this.createTaskUseCase.execute(command);
    console.log(res);
    return { id: res };
  }

  @GrpcMethod('TaskService', 'GetTaskById')
  async getTaskById(dto: GetTaskByIdDto) {
    const res = await this.getTaskByIdUseCase.execute(String(dto.id));

    return res;
  }
}
