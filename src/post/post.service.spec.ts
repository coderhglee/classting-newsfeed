import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Page } from './../page/entities/page.entity';
import { Repository } from 'typeorm';
import { PageService } from './../page/page.service';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let paseService: PageService;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    paseService = module.get<PageService>(PageService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('페이지의 소식을 생성할 수 있다.', async () => {
    const pageFixture = new Page({
      id: 1,
      ownerId: 1,
      name: 'admin',
      region: 'seoul',
    });
    const dtoFixtgure = {
      title: 'post title',
      context: 'post context',
      pageId: 1,
    };
    const fixture = {
      ...dtoFixtgure,
      page: pageFixture,
    };
    jest.spyOn(paseService, 'findById').mockResolvedValue(pageFixture);
    jest.spyOn(postRepository, 'save').mockResolvedValue(new Post(fixture));
    expect(await service.create(dtoFixtgure)).toEqual(fixture);
  });
});
