import { Module } from '@nestjs/common';
import { TaskModule } from '../grpc/notification.module';
import { TaskConsumer } from './notification.consumer';
@Module({
  imports: [TaskModule],
  controllers: [TaskConsumer],
  providers: [],
})
export class TaskConsumerModule {}
