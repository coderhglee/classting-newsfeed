import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Page } from '../page/entities/page.entity';
import { Repository } from 'typeorm';
import { PageService } from '../page/page.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { User } from '../user/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  let pageService: PageService;
  let subscriptionRepository: Repository<Subscription>;

  const mockLoginUser = new User({
    id: '1',
  });

  const mockPage = new Page({
    ownerId: mockLoginUser.id,
    name: 'TEST Page',
    region: 'TEST Region',
  });

  const mockSubscription = new Subscription({
    user: mockLoginUser,
    page: mockPage,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PageService, useValue: { findById: jest.fn() } },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn,
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    pageService = module.get<PageService>(PageService);
    subscriptionRepository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });

  it('subscribePage', async () => {
    jest.spyOn(pageService, 'findById').mockResolvedValue(mockPage);
    jest
      .spyOn(subscriptionRepository, 'create')
      .mockReturnValue(mockSubscription);
    jest
      .spyOn(subscriptionRepository, 'save')
      .mockResolvedValue(mockSubscription);
    expect(await subscriptionService.subscribePage(1, mockLoginUser)).toBe(
      mockSubscription,
    );
  });

  it('findAllSubscribePage', async () => {
    jest
      .spyOn(subscriptionRepository, 'find')
      .mockResolvedValue([mockSubscription]);
    expect(
      await subscriptionService.findAllSubscribePage(mockLoginUser),
    ).toStrictEqual([mockSubscription]);
  });

  it('findAllSubscribePage throw Exception', async () => {
    jest.spyOn(subscriptionRepository, 'find').mockRejectedValue(new Error());
    await expect(
      subscriptionService.findAllSubscribePage(mockLoginUser),
    ).rejects.toThrowError(Error);
  });

  it('findOne', async () => {
    jest
      .spyOn(subscriptionRepository, 'findOne')
      .mockResolvedValue(mockSubscription);
    expect(await subscriptionService.findOne(1, mockLoginUser)).toBe(
      mockSubscription,
    );
  });

  it('findOne throw Exception', async () => {
    jest.spyOn(subscriptionRepository, 'findOne').mockReturnValue(undefined);

    await expect(
      subscriptionService.findOne(1, mockLoginUser),
    ).rejects.toThrowError(NotFoundException);
  });

  it('remove', async () => {
    jest
      .spyOn(subscriptionService, 'findOne')
      .mockResolvedValue(mockSubscription);
    jest
      .spyOn(subscriptionRepository, 'remove')
      .mockResolvedValue(mockSubscription);
    expect(await subscriptionService.remove(1, mockLoginUser)).toBe(
      mockSubscription,
    );
  });

  it('remove throw Exception', async () => {
    jest
      .spyOn(subscriptionService, 'findOne')
      .mockResolvedValue(mockSubscription);
    jest.spyOn(subscriptionRepository, 'remove').mockRejectedValue(new Error());
    await expect(
      subscriptionService.remove(1, mockLoginUser),
    ).rejects.toThrowError(BadRequestException);
  });
});
