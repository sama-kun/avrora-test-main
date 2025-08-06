// src/api-gateway/api-gateway.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskServiceClient } from './task.service.client';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskServiceClient: TaskServiceClient,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  register(@Body() dto: CreateTaskDto) {
    const start = Date.now();

    const res = this.taskServiceClient.createTask(dto);

    const duration = Date.now() - start;
    this.metricsService.recordTask(duration);
    return res;
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    const start = Date.now();

    const res = this.taskServiceClient.getTaskById(id);

    const duration = Date.now() - start;
    this.metricsService.recordTask(duration);
    return res;
  }
}
