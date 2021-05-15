import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUser = [{ id: 1, name: 'hglee' }];

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(mockUser);
  });

  it('/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'hglee', password: 'password', roles: ['admin', 'user'] })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: 'hglee',
          password: 'password',
          roles: ['admin', 'user'],
        });
      });
  });

  it('/user (POST) 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 12345 })
      .expect('Content-Type', /json/)
      .expect(400, {
        statusCode: 400,
        message: [
          'name must be a string',
          'password must be a string',
          'roles must be an array',
        ],
        error: 'Bad Request',
      });
  });
});
