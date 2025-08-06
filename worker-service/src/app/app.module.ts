import { NotificationConsumerModule } from '@/interface/consumer/notification/notification-consumer.module';
import { TaskConsumerModule } from '@/interface/consumer/task/task-consumer.module';
import { KafkaModule } from '@/interface/kafka/kafka.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskConsumerModule,
    NotificationConsumerModule,
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true, // чтобы доступ был во всех модулях без повторного импорта
    }),
  ],
  providers: [
    // {
    //   provide: 'winston',
    //   useValue: winston.createLogger(winstonConfig),
    // },
  ],
})
export class AppModule {}
