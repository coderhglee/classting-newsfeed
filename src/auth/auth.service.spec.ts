import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './../auth/auth.service';
import { User } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByName: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('등록된 유저를 검증할 수 있다.', async () => {
      const singleUserFixture = new User({
        name: 'user_1',
        password: 'password',
        roles: ['admin', 'user'],
      });
      jest
        .spyOn(usersService, 'findByName')
        .mockResolvedValue(singleUserFixture);
      jest.spyOn(singleUserFixture, 'comparePassword').mockReturnValue(true);
      await expect(
        authService.validateUser('user_1', 'password'),
      ).resolves.not.toBeNull();
    });

    it('패스워드가 일치하지 않으면 null을 반환한다.', async () => {
      const singleUserFixture = new User({
        name: 'user_1',
        password: 'password',
        roles: ['admin', 'user'],
      });
      jest.spyOn(singleUserFixture, 'comparePassword').mockReturnValue(false);
      jest
        .spyOn(usersService, 'findByName')
        .mockResolvedValue(singleUserFixture);
      expect(
        await authService.validateUser('user_1', 'notpassword'),
      ).toBeNull();
    });
  });

  describe('login', () => {
    it('access token을 발급한다.', async () => {
      const singleUserFixture = new User({
        name: 'user_1',
        password: 'password',
        roles: ['admin', 'user'],
      });

      jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');
      jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(singleUserFixture);
      expect(
        await authService.login({ username: 'user_1', password: 'password' }),
      ).toStrictEqual({
        access_token: 'access_token',
      });
    });

    it('유저 정보가 일치하지 않으면 에러를 반환한다.', async () => {
      jest.spyOn(authService, 'validateUser').mockReturnValue(undefined);
      await expect(
        authService.login({ username: 'user_1', password: 'password' }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
