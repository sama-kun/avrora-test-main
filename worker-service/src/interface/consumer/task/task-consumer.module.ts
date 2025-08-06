import { ProcessTaskInputUseCase } from '@/application/usecases/process-task-input.use-case';
import { KafkaModule } from '@/interface/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { TaskConsumer } from './task.consumer';
@Module({
  imports: [KafkaModule],
  controllers: [TaskConsumer],
  providers: [ProcessTaskInputUseCase],
})
export class TaskConsumerModule {}
