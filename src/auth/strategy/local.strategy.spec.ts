import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = app.get<LocalStrategy>(LocalStrategy);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should validate', async () => {
    const userFixture = new User({
      id: 1,
      name: 'hglee',
    });
    jest.spyOn(authService, 'validateUser').mockResolvedValue(userFixture);
    expect(await strategy.validate('admin', 'admin')).toBe(userFixture);
  });

  it('should validate throw exception', async () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValue(undefined);
    try {
      await strategy.validate('admin', 'admin');
    } catch (error) {
      expect(error.getResponse()).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }
  });
});
