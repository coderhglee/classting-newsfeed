import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { Page } from './../../page/entities/page.entity';
import { PageService } from './../../page/page.service';
import { UserIsOwnerGuard } from './user-is-owner.guard';
import { mock } from 'jest-mock-extended';
import { User } from './../../user/entities/user.entity';

describe('UserIsOwnerGuard', () => {
  let userIsOwnerGuard: UserIsOwnerGuard;
  let pageService: PageService;
  let executionContext: ExecutionContext;
  let httpContext: HttpArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserIsOwnerGuard,
        {
          provide: PageService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userIsOwnerGuard = module.get<UserIsOwnerGuard>(UserIsOwnerGuard);
    pageService = module.get<PageService>(PageService);
    executionContext = mock<ExecutionContext>();
    httpContext = mock<HttpArgumentsHost>();
  });
  it('should be defined', () => {
    expect(userIsOwnerGuard).toBeDefined();
  });

  it('페이지 Guard 접근시 해당 ownerId가 일치하면 true를 반환한다.', async () => {
    const userFixture = new User({
      id: 'uuid',
    });
    const pageFixture = new Page({ id: 2, ownerId: userFixture.id });
    jest.spyOn(pageService, 'findById').mockResolvedValue(pageFixture);
    jest.spyOn(executionContext, 'switchToHttp').mockReturnValue(httpContext);
    jest.spyOn(httpContext, 'getRequest').mockReturnValue({
      body: {
        pageId: pageFixture.id,
      },
      user: userFixture,
    });
    const result = await userIsOwnerGuard.canActivate(executionContext);
    expect(result).toBe(true);
  });

  it('페이지 Guard 접근시 해당 ownerId가 일치하지 않으면 false를 반환한다.', async () => {
    const userFixture = new User({
      id: 'uuid',
    });
    const pageFixture = new Page({ id: 2, ownerId: 'uuid_test' });
    jest.spyOn(pageService, 'findById').mockResolvedValue(pageFixture);
    jest.spyOn(executionContext, 'switchToHttp').mockReturnValue(httpContext);
    jest.spyOn(httpContext, 'getRequest').mockReturnValue({
      body: {
        pageId: pageFixture.id,
      },
      user: userFixture,
    });
    await expect(
      userIsOwnerGuard.canActivate(executionContext),
    ).rejects.toThrowError(UnauthorizedException);
  });
});
