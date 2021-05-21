import { Inject, Injectable } from '@nestjs/common';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    @Inject('PublishEventStore')
    private readonly eventStore: PublishEventStore,
  ) {}
}
