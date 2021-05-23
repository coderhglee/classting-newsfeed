import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guard/roles.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1 };
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
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    // given
    const userFixture = { name: 'admin', password: 'admin', role: 'admin' };
    const createUserRequest = await request(app.getHttpServer())
      .post('/user')
      .send(userFixture);
    expect(createUserRequest.status).toBe(201);

    // when then
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ access_token: expect.any(String) });
      });
  });
});
