import { TaskEntity } from '../entities/task.entity';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

export interface TaskRepositoryInterface {
  save(task: TaskEntity): Promise<string>;
  findById(id: string): Promise<TaskEntity | null>;
  update(task: TaskEntity): Promise<TaskEntity>;
}
