// kafka-event.publisher.ts
import {
  EventPublisherInterface,
  KAFKA_CLIENT,
} from '@/domain/services/event-publisher.interface';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Message, Producer } from 'kafkajs';

@Injectable()
export class KafkaEventPublisher
  implements EventPublisherInterface, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(KafkaEventPublisher.name);
  private readonly producer: Producer;

  constructor(@Inject(KAFKA_CLIENT) private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log(`[KafkaEventBus] ✅ Connected to Kafka`);
  }

  async publish<T = unknown>(topic: string, payload: T): Promise<void> {
    const message: Message = {
      value: JSON.stringify(payload),
    };

    await this.producer.send({
      topic,
      messages: [message],
    });

    this.logger.log(`[KafkaEventBus] 📤 Event sent to "${topic}"`, payload);
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    this.logger.log(`[KafkaEventBus] 🔌 Disconnected from Kafka`);
  }
}
