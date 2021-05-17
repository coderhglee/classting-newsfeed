import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppService } from './../src/app.service';
import { AuthService } from './../src/auth/auth.service';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guard/roles.guard';
import { LocalAuthGuard } from '../src/auth/guard/local-auth.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

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
      providers: [AppService],
    })
      .overrideProvider(AuthService)
      .useValue({
        login: jest.fn(),
      })
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(LocalAuthGuard)
      .useValue(authGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/login (POST)', async () => {
    jest
      .spyOn(authService, 'login')
      .mockReturnValue({ access_token: 'access_token' });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(200, { access_token: 'access_token' });
  });

  it('/profile (GET) ', () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'abcd')
      .expect(200)
      .expect({ id: 1 });
  });
});
