import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './../../user/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = app.get<JwtStrategy>(JwtStrategy);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate', async () => {
    const payload = {
      userId: '1',
      userName: 'test',
    };
    const userFixture = new User({
      id: '1',
      name: 'hglee',
    });
    jest.spyOn(authService, 'validateUserById').mockResolvedValue(userFixture);
    expect(await strategy.validate(payload)).toBe(userFixture);
  });

  it('should validate throw exception', async () => {
    const payload = {
      userId: '1',
      userName: 'test',
    };
    jest.spyOn(authService, 'validateUserById').mockResolvedValue(undefined);
    try {
      await strategy.validate(payload);
    } catch (error) {
      expect(error.getResponse()).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }
  });
});
