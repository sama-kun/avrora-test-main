import { v4 as uuidv4 } from 'uuid';
import { NotificationStatusEnum } from './notification-status.enum';
import { NotificationTypeEnum } from './notification-type.enum';

export class NotificationEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly type: NotificationTypeEnum;
  public status: NotificationStatusEnum;
  public updatedAt: Date;
  public message: string;
  public userId: string;

  constructor(
    message: string,
    userId: string,
    type: NotificationTypeEnum = NotificationTypeEnum.SMS,
    status: NotificationStatusEnum = NotificationStatusEnum.PENDING,
    id: string = uuidv4(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
  }

  markSent() {
    this.status = NotificationStatusEnum.SENT;
    this.updatedAt = new Date();
  }

  markRetrying() {
    this.status = NotificationStatusEnum.RETRYING;
    this.updatedAt = new Date();
  }

  markRead() {
    this.status = NotificationStatusEnum.READ;
    this.updatedAt = new Date();
  }

  markFailed() {
    this.status = NotificationStatusEnum.FAILED;
    this.updatedAt = new Date();
  }
}
