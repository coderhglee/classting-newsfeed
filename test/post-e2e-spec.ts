import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import * as redis from 'redis-mock';
import { REDIS_CLIENT } from 'src/publish/infra/publish-event.constants';
import * as request from 'supertest';
import { CreatePageDto } from 'src/page/dto/create-page.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { resetEntity } from './util/orm-util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockUser: User = new User({
    id: 'uuid',
    name: 'user',
    password: 'password',
    role: UserRole.ADMIN,
  });

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      const req = context.switchToHttp().getRequest();
      req.user = mockUser;
      return true;
    },
  };
  const rolesGuardMock = { canActivate: (): any => true };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(REDIS_CLIENT)
      .useFactory(redis.createClient())
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/post (POST)', async () => {
    // given
    const mockPageRequest = await proCreatePage(
      app,
      new CreatePageDto({
        name: 'test_page',
        region: 'test_region',
      }),
    );
    const mockPost = new CreatePostDto({
      pageId: mockPageRequest.body.id,
      title: 'test post title',
      context: 'test post context',
    });
    const createdPost = await preCreatePost(app, mockPost);
    expect(createdPost.statusCode).toEqual(201);
  });

  it('/post (Patch)', async () => {
    // given
    const mockPageRequest = await proCreatePage(
      app,
      new CreatePageDto({
        name: 'test_page',
        region: 'test_region',
      }),
    );
    const mockPost = new CreatePostDto({
      pageId: mockPageRequest.body.id,
      title: 'test post title',
      context: 'test post context',
    });
    const createdPost = await preCreatePost(app, mockPost);
    expect(createdPost.statusCode).toEqual(201);

    const updatePostDto = new UpdatePostDto({
      title: 'test post title_update',
      context: 'test post context_update',
    });
    return request(app.getHttpServer())
      .patch(`/post/${createdPost.body.id}`)
      .send(updatePostDto)
      .then((res) => {
        expect(res.body.title).toBe(updatePostDto.title);
        expect(res.body.context).toBe(updatePostDto.context);
      });
  });

  it('/post (Delete)', async () => {
    // given
    const mockPageRequest = await proCreatePage(
      app,
      new CreatePageDto({
        name: 'test_page',
        region: 'test_region',
      }),
    );
    const mockPost = new CreatePostDto({
      pageId: mockPageRequest.body.id,
      title: 'test post title',
      context: 'test post context',
    });
    const createdPost = await preCreatePost(app, mockPost);
    expect(createdPost.statusCode).toEqual(201);

    return request(app.getHttpServer())
      .delete(`/post/${createdPost.body.id}`)
      .expect(200);
  });

  afterEach(async () => {
    await app.close();
    await resetEntity();
  });
});
async function preCreatePost(app: INestApplication, mockPost: CreatePostDto) {
  return request(app.getHttpServer()).post('/post').send(mockPost);
}
async function proCreatePage(app: INestApplication, mockPage: CreatePageDto) {
  return request(app.getHttpServer()).post('/page').send(mockPage);
}
