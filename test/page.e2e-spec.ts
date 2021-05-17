import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageModule } from '../src/page/page.module';
import { Page } from '../src/page/entities/page.entity';
import { User } from '../src/user/entities/user.entity';
import { PageService } from '../src/page/page.service';
import { RolesGuard } from '../src/auth/guard/roles.guard';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';

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
      imports: [PageModule],
    })
      .overrideProvider(getRepositoryToken(Page))
      .useValue({})
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(PageService)
      .useValue({
        create: jest.fn().mockResolvedValue({}),
      })
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/page (POST)', () => {
    return request(app.getHttpServer())
      .post('/page')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json')
      .expect(201);
  });
});
