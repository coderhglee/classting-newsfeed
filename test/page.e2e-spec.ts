import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { User, UserRole } from '../src/user/entities/user.entity';
import { RolesGuard } from '../src/auth/guard/roles.guard';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';
import { AppModule } from 'src/app.module';
import { CreatePageDto } from 'src/page/dto/create-page.dto';
import { Reflector } from '@nestjs/core';

describe('PageController (e2e)', () => {
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
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    await app.init();
  });

  it('/page (POST)', () => {
    // given
    const mockPage = new CreatePageDto({
      name: 'test_page',
      region: 'test_region',
    });
    // when then
    return request(app.getHttpServer())
      .post('/page')
      .send(mockPage)
      .expect(201);
  });

  it('/get (Patch)', async () => {
    // given
    const mockPage = new CreatePageDto({
      name: 'test_page',
      region: 'test_region',
    });
    const createdPage = await request(app.getHttpServer())
      .post('/page')
      .send(mockPage);
    const { id, name, region } = createdPage.body;
    // when
    const updateRequest = await request(app.getHttpServer()).get(`/page/${id}`);
    // then
    expect(updateRequest.status).toBe(200);
    expect(updateRequest.body.name).toBe(name);
    expect(updateRequest.body.region).toBe(region);
  });

  afterEach(async () => {
    await app.close();
  });
});
