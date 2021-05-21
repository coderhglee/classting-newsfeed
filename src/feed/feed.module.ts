import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { PublishModule } from 'src/publish/publish.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Module({
  imports: [PublishModule, SubscriptionModule],
  controllers: [FeedController],
  providers: [FeedService, PublishEventStore, SubscriptionService],
})
export class FeedModule {}
