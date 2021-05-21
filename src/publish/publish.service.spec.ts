import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Page } from 'src/page/entities/page.entity';
import { PageService } from 'src/page/page.service';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { User } from 'src/user/entities/user.entity';
import { PublishEventStore } from './infra/publish-event-store';
import { PublishService } from './publish.service';

describe('PublishService', () => {
  let service: PublishService;
  let subscriptionService: SubscriptionService;
  let eventStore: PublishEventStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishService,
        PageService,
        {
          provide: getRepositoryToken(Page),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {},
        },
        {
          provide: SubscriptionService,
          useValue: {
            findAllUserBySubscribePage: jest.fn(),
          },
        },
        {
          provide: PublishEventStore,
          useValue: {
            publishEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PublishService>(PublishService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    eventStore = module.get<PublishEventStore>(PublishEventStore);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish post event', async () => {
    const userFixture = new User({ id: 1 });
    const pageFixture = new Page({ id: 1 });
    const subFixture = new Subscription({
      user: userFixture,
      page: pageFixture,
    });
    const findSubPage = jest
      .spyOn(subscriptionService, 'findAllUserBySubscribePage')
      .mockResolvedValue([subFixture, subFixture]);
    const mockPublishEvent = jest.spyOn(eventStore, 'publishEvent');
    await service.publishPost(pageFixture, 1);
    expect(findSubPage).toHaveBeenCalledTimes(1);
    expect(mockPublishEvent).toHaveBeenCalledTimes(2);
  });
});
