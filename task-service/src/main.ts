import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'task',
        protoPath: [
          join(process.cwd(), 'proto/task.proto'),
          // join(process.cwd(), 'proto/notification.proto'),
        ],
        url: `0.0.0.0:${process.env.PORT}`,
      },
    },
  );

  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKERS
            ? process.env.KAFKA_BROKERS.split(',')
            : ['localhost:9092'],
        },
        consumer: {
          groupId: 'task-consumer-group-server',
        },
      },
    },
  );

  await grpcApp.listen();
  await kafkaApp.listen();

  console.log(`🚀 gRPC: 0.0.0.0:${process.env.PORT}`);
  console.log(`📬 Kafka consumer listening...`);
}
bootstrap().catch((e) => {
  throw new Error(e);
});
