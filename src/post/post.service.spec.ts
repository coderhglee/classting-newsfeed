import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Page } from './../page/entities/page.entity';
import { Repository } from 'typeorm';
import { PageService } from './../page/page.service';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PublishService } from 'src/publish/publish.service';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let pageService: PageService;
  let publishService: PublishService;
  let postRepository: Repository<Post>;

  const existPostFixture = {
    title: 'post title',
    context: 'post context',
    pageId: 1,
    create_at: expect.any(Date),
    update_at: expect.any(Date),
  };

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
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: PublishService,
          useValue: {
            publishPost: jest.fn(),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    pageService = module.get<PageService>(PageService);
    publishService = module.get<PublishService>(PublishService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('페이지의 소식을 생성할 수 있다.', async () => {
    const pageFixture = new Page({
      id: 1,
      ownerId: '1',
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
    jest.spyOn(pageService, 'findById').mockResolvedValue(pageFixture);
    jest.spyOn(postRepository, 'save').mockResolvedValue(new Post(fixture));
    jest.spyOn(publishService, 'publishPost').mockReturnThis();
    expect(await postService.create(dtoFixtgure)).toEqual(fixture);
  });

  it('소식을 찾을수 없을때 에러를 발생한다.', async () => {
    jest.spyOn(postRepository, 'findOne').mockReturnValue(undefined);
    await expect(postService.findOne(1)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('페이지의 소식을 수정할 수 있다.', () => {
    const updatePostFixture = {
      title: 'post title_update',
      context: 'post context_update',
    };
    const resultFixture = {
      ...existPostFixture,
      ...updatePostFixture,
    };
    jest
      .spyOn(postRepository, 'save')
      .mockResolvedValue(new Post(resultFixture));

    jest
      .spyOn(postService, 'findOne')
      .mockResolvedValue(new Post(existPostFixture));

    expect(postService.update(1, updatePostFixture)).resolves.toEqual(
      new Post(resultFixture),
    );
  });

  it('페이지 소식 삭제 할수 있다.', async () => {
    jest
      .spyOn(postRepository, 'remove')
      .mockResolvedValue(new Post(existPostFixture));

    jest
      .spyOn(postService, 'findOne')
      .mockResolvedValue(new Post(existPostFixture));
    expect(await postService.remove(1)).toEqual(existPostFixture);
  });
});
