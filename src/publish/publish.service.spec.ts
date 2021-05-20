import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Page } from 'src/page/entities/page.entity';
import { PageService } from 'src/page/page.service';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PublishEventStore } from './infra/publish-event-store';
import { PublishService } from './publish.service';

describe('PublishService', () => {
  let service: PublishService;

  class RedisClientMock {
    get;
    set;
    constructor() {
      this.get = jest.fn();
      this.set = jest.fn();
    }
  }

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
        SubscriptionService,
        { provide: PublishEventStore, useClass: RedisClientMock },
      ],
    }).compile();

    service = module.get<PublishService>(PublishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
