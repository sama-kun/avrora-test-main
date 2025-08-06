// kafka.module.ts
import {
  KAFKA_CLIENT,
  KAFKA_SERVICE,
} from '@/domain/services/event-publisher.interface';
import { KafkaEventPublisher } from '@/infrastructure/kafka/kafka-event-bus.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Module({
  providers: [
    {
      provide: KAFKA_CLIENT,
      useFactory: async (configService: ConfigService) => {
        return new Kafka({
          clientId: configService.get<string>('KAFKA_CLIENT_ID'),
          brokers: [configService.get<string>('KAFKA_BROKERS')],
        });
      },
      inject: [ConfigService],
    },
    KafkaEventPublisher,
    {
      provide: KAFKA_SERVICE,
      useExisting: KafkaEventPublisher,
    },
  ],
  exports: [KAFKA_SERVICE],
})
export class KafkaModule {}
