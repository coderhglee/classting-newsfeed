import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { RolesGuard } from './../auth/guard/roles.guard';
import { Page } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

describe('PageController', () => {
  let controller: PageController;
  let service: PageService;

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1 };
      return true;
    },
  };
  const rolesGuardMock = { canActivate: (): any => true };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
      providers: [
        {
          provide: PageService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<PageController>(PageController);
    service = module.get<PageService>(PageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', async () => {
    const loginUserRequest = {
      user: {
        id: 2,
        name: 'admin',
      },
    };
    const pageFixture = new Page({
      ownerId: loginUserRequest.user.id,
      name: 'TEST_SCHOOL',
      region: 'seoul',
    });
    jest.spyOn(service, 'create').mockResolvedValue(pageFixture);
    expect(
      await controller.create(loginUserRequest, {
        name: 'TEST_SCHOOL',
        region: 'seoul',
      }),
    ).toEqual(pageFixture);
  });
});
