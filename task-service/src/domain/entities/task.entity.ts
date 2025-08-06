import { v4 as uuidv4 } from 'uuid';
import { TaskStatusEnum } from './task-status.enum';

export class TaskEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public status: TaskStatusEnum;
  public result: string | null;

  constructor(
    public readonly payload: string,
    public readonly priority: number,
    id: string = uuidv4(),
    status: TaskStatusEnum = TaskStatusEnum.PENDING,
    result: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.status = status;
    this.result = result;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markProcessing() {
    this.status = TaskStatusEnum.PROCESSING;
    this.updatedAt = new Date();
  }

  markDone(result: string, processedAt: Date = new Date()) {
    this.status = TaskStatusEnum.DONE;
    this.result = result;
    this.updatedAt = processedAt;
    this.updatedAt = new Date();
  }

  markFailed() {
    this.status = TaskStatusEnum.FAILED;
    this.updatedAt = new Date();
  }
}
