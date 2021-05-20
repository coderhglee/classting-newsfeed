import { Module } from '@nestjs/common';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PublishEventStore } from './infra/publish-event-store';
import { PublishService } from './publish.service';

@Module({
  imports: [SubscriptionModule],
  providers: [PublishService, PublishEventStore],
  exports: [PublishService],
})
export class PublishModule {}
