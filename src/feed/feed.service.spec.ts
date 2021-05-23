import { Test, TestingModule } from '@nestjs/testing';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { User } from 'src/user/entities/user.entity';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let feedService: FeedService;
  let publishEventStore: PublishEventStore;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: PublishEventStore,
          useValue: {
            getPublishedEvent: jest.fn(),
          },
        },
        {
          provide: PostService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    feedService = module.get<FeedService>(FeedService);
    publishEventStore = module.get<PublishEventStore>(PublishEventStore);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(feedService).toBeDefined();
  });

  it('유저에게 학교 소식을 노출한다.', async () => {
    const mockUser = new User({ id: 'uuid' });
    const getPublishedEvent = jest.spyOn(
      publishEventStore,
      'getPublishedEvent',
    );
    const findOne = jest.spyOn(postService, 'findOne');
    getPublishedEvent.mockResolvedValue(['1', '2']);
    findOne.mockResolvedValue(expect.any(Post));
    await feedService.findNewsFeed(0, 10, mockUser);
    expect(getPublishedEvent).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledTimes(2);
  });
});
