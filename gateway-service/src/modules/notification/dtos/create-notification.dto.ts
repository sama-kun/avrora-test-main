import { NotificationTypeEnum } from '@/entities/notification/notification-type.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString() // лень будет отправить UUID и просто опишу как стринг
  userId: string;

  @IsNotEmpty()
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;

  @IsNotEmpty()
  @IsString()
  message: string;
}
