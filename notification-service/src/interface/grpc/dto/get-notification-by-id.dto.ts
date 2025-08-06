import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetNotificationByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
