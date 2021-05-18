import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageModule } from './../page/page.module';
import { PageService } from './../page/page.service';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostModule } from './post.module';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  // @Module({
  //   imports: [TypeOrmModule.forFeature([Post]), PageModule],
  //   controllers: [PostController],
  //   providers: [PostService],
  // })
  // export class PostModule {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [PageModule],
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    // jest.spyOn(service,'')
    expect(controller).toBeDefined();
  });
});
