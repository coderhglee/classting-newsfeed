import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';

describe('AppController', () => {
  let appController: AppController;

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1 };
      return true;
    },
  };
  const rolesGuardMock = { canActivate: (): any => true };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(LocalAuthGuard)
      .useValue(authGuardMock)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
