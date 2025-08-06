import { CreateNotificationUseCase } from '@/application/usecases/create-notification.use-case';
import { GetByIdNotificationUseCase } from '@/application/usecases/get-notification-by-id.use-case';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationByIdDto } from './dto/get-notification-by-id.dto';
import { NotificationMapper } from './notification.mapper';

@Controller()
export class TaskController {
  constructor(
    private readonly getNotificationByIdUsecase: GetByIdNotificationUseCase,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createTask(dto: CreateNotificationDto) {
    const command = NotificationMapper.toCreateNotificationCommand(dto);

    const res = await this.createNotificationUseCase.execute(command);
    return { id: res };
  }

  @GrpcMethod('NotificationService', 'GetNotificationById')
  async getTaskById(dto: GetNotificationByIdDto) {
    const status = await this.getNotificationByIdUsecase.execute(
      String(dto.id),
    );
    return { status };
  }
}
// {
//   userId: string;
//   type: 'email' | 'sms';
//   message: string;
// }

// notifications(id, user_id, type, message, status, created_at).
