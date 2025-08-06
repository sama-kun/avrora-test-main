import { CreateTaskCommand } from '@/application/command/create-task.command';
import { CreateTaskDto } from '@/interface/grpc/dto/create-task.dto';

export class TaskMapper {
  static toCreateTaskCommand(dto: CreateTaskDto): CreateTaskCommand {
    return new CreateTaskCommand(dto.payload, dto.priority);
  }
}
