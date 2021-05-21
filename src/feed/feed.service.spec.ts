import { Test, TestingModule } from '@nestjs/testing';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: PublishEventStore, useValue: {} },
        { provide: SubscriptionService, useValue: {} },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
