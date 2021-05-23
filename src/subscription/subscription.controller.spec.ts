import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FindSubscriptionIdParamDto } from './dto/find-subscription-id.param.dto';
import { FindSubscriptionPageIdParamDto } from './dto/find-subscription-pageId.param.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  const loginUserRequest = {
    user: {
      id: 1,
    },
  };

  const authGuardMock = {
    canActivate: (context: ExecutionContext): any => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1 };
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            findAllSubscribePage: jest.fn(),
            subscribePage: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuardMock)
      .compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('findAll', () => {
    expect(controller).toBeDefined();
  });

  it('subscribePage', async () => {
    const subFixture = new Subscription({});
    jest.spyOn(service, 'findAllSubscribePage').mockResolvedValue([subFixture]);
    expect(await controller.findAll(loginUserRequest)).toStrictEqual([
      subFixture,
    ]);
  });

  it('removeSubscribtion', async () => {
    const subFixture = new Subscription({});
    jest.spyOn(service, 'subscribePage').mockResolvedValue(subFixture);
    expect(
      await controller.subscribePage(
        loginUserRequest,
        new FindSubscriptionPageIdParamDto({ pageId: 1 }),
      ),
    ).toBe(subFixture);
  });

  it('should be defined', async () => {
    const subFixture = new Subscription({});
    jest.spyOn(service, 'remove').mockResolvedValue(subFixture);
    expect(
      await controller.removeSubscribtion(
        loginUserRequest,
        new FindSubscriptionIdParamDto({ id: 1 }),
      ),
    ).toBe(subFixture);
  });
});
