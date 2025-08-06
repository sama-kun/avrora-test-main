import { Module } from '@nestjs/common';
import { NotificationModule } from '../grpc/notification.module';
import { NotificationStatusConsumer } from './notification.consumer';
@Module({
  imports: [NotificationModule],
  controllers: [NotificationStatusConsumer],
  providers: [],
})
export class NotificationConsumerModule {}
