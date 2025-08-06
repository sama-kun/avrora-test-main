import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTaskByIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
