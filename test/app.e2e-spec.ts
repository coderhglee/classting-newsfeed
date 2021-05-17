import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/user/entities/user.entity';
import { AuthService } from './../src/auth/auth.service';
import { UserService } from './../src/user/user.service';
import { LocalStrategy } from './../src/auth/local.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        UserService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/login (POST)', () => {
    const singleUserFixture = new User({
      name: 'admin',
      password: 'admin',
      roles: ['admin', 'user'],
    });
    jest
      .spyOn(authService, 'validateUser')
      .mockResolvedValue(singleUserFixture);
    jest
      .spyOn(authService, 'login')
      .mockResolvedValue({ access_token: 'access_token' });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(200, { access_token: 'access_token' });
  });

  it('/auth/login (POST) Return 401 유저 인증 실패', () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(401, { statusCode: 401, message: 'Unauthorized' });
  });
});
