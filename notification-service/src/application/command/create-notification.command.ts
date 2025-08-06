import { NotificationTypeEnum } from '@/domain/entities/notification-type.enum';

export class CreateNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly type: NotificationTypeEnum,
    public readonly message: string,
  ) {}
}
