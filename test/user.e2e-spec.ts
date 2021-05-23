import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { resetEntity } from './util/orm-util';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const createMockUser = (mockApp: INestApplication, user: any) => {
    return request(mockApp.getHttpServer()).post('/user').send(user);
  };

  const userFixture = { name: 'admin', password: 'admin', role: 'admin' };
  const requestUserFixture = {
    id: expect.any(String),
    name: userFixture.name,
    role: userFixture.role,
    createAt: expect.any(String),
    updateAt: expect.any(String),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user (POST)', async () => {
    return createMockUser(app, userFixture)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual(requestUserFixture);
      });
  });

  it('/user (GET)', async () => {
    // given
    const createMockRequest = await createMockUser(app, userFixture);
    const { id, name } = createMockRequest.body;
    // when then
    await request(app.getHttpServer())
      .get(`/user/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(requestUserFixture);
      });
    await request(app.getHttpServer())
      .get(`/user/name/${name}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(requestUserFixture);
      });
  });

  it('/user (Patch)', async () => {
    // given
    const createMockRequest = await createMockUser(app, userFixture);
    const { id } = createMockRequest.body;
    // when then
    return request(app.getHttpServer())
      .patch(`/user/${id}`)
      .send({ password: 'password_update', role: 'user' })
      .expect(200)
      .then((res) => {
        expect(res.body.password).toEqual('password_update');
        expect(res.body.role).toEqual('user');
      });
  });

  it('/user (Delete)', async () => {
    // given
    const createMockRequest = await createMockUser(app, userFixture);
    const { id } = createMockRequest.body;
    // when then
    await request(app.getHttpServer()).delete(`/user/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/user/${id}`).expect(404);
  });

  afterEach(async () => {
    await app.close();
    await resetEntity();
  });
});
