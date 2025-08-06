import { TaskConsumerModule } from '@/interface/consumer/notification-consumer.module';
import { TaskModule } from '@/interface/grpc/notification.module';
import { KafkaModule } from '@/interface/kafka/kafka.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskModule,
    KafkaModule,
    TaskConsumerModule,
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
