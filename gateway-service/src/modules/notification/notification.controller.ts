import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationServiceClient } from './notification.service.client';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationServiceClient: NotificationServiceClient,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  async register(@Body() dto: CreateNotificationDto) {
    const start = Date.now();

    const res = this.notificationServiceClient.createNotification(dto);

    const duration = Date.now() - start;
    this.metricsService.recordTask(duration);
    return res;
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    const start = Date.now();
    const res = this.notificationServiceClient.getNotificationById(id);
    const duration = Date.now() - start;
    this.metricsService.recordTask(duration);
    return res;
  }
}
