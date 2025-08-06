import { NotificationStatusEnum } from '@/domain/entities/notification-status.enum';

export class UpdateNotificationCommand {
  public readonly notificationId: string;
  public readonly status: NotificationStatusEnum;
}
