import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from 'src/post/post.service';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: PublishEventStore, useValue: {} },
        { provide: PostService, useValue: {} },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
