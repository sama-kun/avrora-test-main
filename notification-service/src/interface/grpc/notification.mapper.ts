import { CreateNotificationCommand } from '@/application/command/create-notification.command';
import { CreateNotificationDto } from './dto/create-notification.dto';

export class NotificationMapper {
  static toCreateNotificationCommand(
    dto: CreateNotificationDto,
  ): CreateNotificationCommand {
    return new CreateNotificationCommand(dto.userId, dto.type, dto.message);
  }
}
