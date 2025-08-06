// src/api-gateway/user/user.service.client.ts
import {
  REDIS_CLIENT_SERVICE,
  RedisClientServiceInterface,
} from '@/common/services/redis.service';
import { TaskEntity } from '@/entities/task/task.entity';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskByIdDto } from './dtos/get-task-by-id.dto';

export const TASK_SERVICE = 'TASK_SERVICE';

interface TaskServiceInterface {
  createTask(data: CreateTaskDto): Observable<{ id: string }>;
  getTaskById(data: GetTaskByIdDto): Observable<TaskEntity>;
}

@Injectable()
export class TaskServiceClient implements OnModuleInit {
  private taskService: TaskServiceInterface;

  private readonly logger = new Logger(TaskServiceClient.name);

  constructor(
    @Inject(TASK_SERVICE) private client: ClientGrpc,
    @Inject(REDIS_CLIENT_SERVICE)
    private readonly redis: RedisClientServiceInterface,
  ) {}

  onModuleInit() {
    this.taskService =
      this.client.getService<TaskServiceInterface>('TaskService');
  }

  createTask(data: CreateTaskDto) {
    return this.taskService.createTask(data);
  }

  async getTaskById(id: string) {
    const key = `task:result:${id}`;
    const stringTask = await this.redis.get(key);
    const cacheTask = JSON.parse(stringTask);
    if (cacheTask && Object.keys(cacheTask).length > 0) {
      this.logger.log('Got from cache', cacheTask);
      return cacheTask;
    }
    const res = this.taskService.getTaskById({ id });
    return res;
  }
}
