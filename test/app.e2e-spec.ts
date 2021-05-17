import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/user/entities/user.entity';
import { AuthService } from './../src/auth/auth.service';
import { UserService } from './../src/user/user.service';
import { LocalStrategy } from './../src/auth/strategy/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/strategy/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [
        {
          provide: JwtStrategy,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
          },
        },
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
            validateUserById: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
    await app.init();
  });

  it('/ (GET)', () => {
    const singleUserFixture = new User({
      name: 'admin',
      password: 'admin',
      roles: ['admin', 'user'],
    });
    jest.spyOn(jwtService, 'decode').mockReturnValue('ok');
    jest
      .spyOn(authService, 'validateUserById')
      .mockResolvedValue(singleUserFixture);
    jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(singleUserFixture);

    // AuthGuard('jwt').prototype.canActivate = jest.fn(() =>
    //   Promise.resolve(true),
    // );

    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', 'Bearer token')
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

  it('/profile (GET) ', () => {
    // jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
    const singleUserFixture = new User({
      name: 'admin',
      password: 'admin',
      roles: ['admin', 'user'],
    });
    // jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(singleUserFixture);
    // jest.spyOn(authService, 'validateUser').mockResolvedValue(undefined);
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'abcd')
      .expect(200)
      .expect('Hello World!');
  });
});
