import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PublishEventStore } from './infra/publish-event-store';
import { PublishService } from './publish.service';

@Module({
  imports: [SubscriptionModule, RedisModule],
  providers: [PublishService, PublishEventStore],
  exports: [PublishService, PublishEventStore],
})
export class PublishModule {}
