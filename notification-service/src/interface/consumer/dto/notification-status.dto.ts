import { NotificationStatusEnum } from '@/domain/entities/notification-status.enum';

export class NotificationStatusDto {
  notificationId: string;
  status: NotificationStatusEnum;
}
