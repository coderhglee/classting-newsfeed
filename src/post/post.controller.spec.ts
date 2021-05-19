import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { UserIsOwnerGuard } from './guards/user-is-owner.guard';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            findOneByRelatedPage: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(UserIsOwnerGuard)
      .useValue(authGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('findOne', async () => {
    const postFixture = expect.any(Post);
    jest.spyOn(service, 'findOneByRelatedPage').mockResolvedValue(postFixture);
    expect(await controller.findOne('1')).toBe(postFixture);
  });

  it('create', async () => {
    const postFixture = expect.any(Post);
    jest.spyOn(service, 'create').mockResolvedValue(postFixture);
    expect(await controller.create(expect.any(CreatePostDto))).toBe(
      postFixture,
    );
  });

  it('update', async () => {
    const postFixture = expect.any(Post);
    jest.spyOn(service, 'update').mockResolvedValue(postFixture);
    expect(await controller.update('1', expect.any(UpdatePostDto))).toBe(
      postFixture,
    );
  });

  it('remove', async () => {
    const postFixture = expect.any(Post);
    jest.spyOn(service, 'remove').mockResolvedValue(postFixture);
    expect(await controller.remove('1')).toBe(postFixture);
  });
});
