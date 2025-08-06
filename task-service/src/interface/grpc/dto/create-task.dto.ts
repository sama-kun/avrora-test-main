import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  payload: string;

  @IsNotEmpty()
  @IsInt()
  priority: number;
}
