import { NotificationTypeEnum } from '@/domain/entities/notification/notification-type.enum';

export class NotificationInputDto {
  notificationId: string;
  message: string;
  userId: string;
  type: NotificationTypeEnum;
}
