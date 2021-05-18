import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageService } from './../page/page.service';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [PostModule, PageModule],
      providers: [
        PostService,
        {
          provide: PageService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
