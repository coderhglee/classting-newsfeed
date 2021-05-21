import { Test, TestingModule } from '@nestjs/testing';
import { RedisClient } from 'redis';
import { PublishEventStore } from './publish-event-store';
import { REDIS_CLIENT } from './publish-event.constants';

describe('PublishService', () => {
  let publishEventStore: PublishEventStore;
  let redisClient: RedisClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishEventStore, { provide: REDIS_CLIENT, useValue: {} }],
    }).compile();

    publishEventStore = module.get<PublishEventStore>(PublishEventStore);
    redisClient = module.get(REDIS_CLIENT);
  });

  it('should be defined', () => {
    expect(publishEventStore).toBeDefined();
    expect(redisClient).toBeDefined();
  });
});
