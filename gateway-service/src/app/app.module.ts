import {
  AnyExceptionFilter,
  HttpExceptionFilter,
} from '@/common/filters/HttpException.filter';
import { TransformInterceptor } from '@/common/interceptors';
import { MetricsModule } from '@/modules/metrics/metrics.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { TaskModule } from '@/modules/task/task.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TaskModule,
    NotificationModule,
    MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true, // чтобы доступ был во всех модулях без повторного импорта
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   provide: 'winston',
    //   useValue: winston.createLogger(winstonConfig),
    // },
  ],
  exports: [MetricsModule],
})
export class AppModule {}
