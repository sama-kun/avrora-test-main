import { NotificationEntity } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY = 'TASK_REPOSITORY';

export interface NotificationRepositoryInterface {
  save(task: NotificationEntity): Promise<string>;
  findById(id: string): Promise<NotificationEntity | null>;
  update(task: NotificationEntity): Promise<NotificationEntity>;
}
