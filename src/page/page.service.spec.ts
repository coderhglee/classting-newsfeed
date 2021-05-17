import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { PageService } from './page.service';

describe('PageService', () => {
  let service: PageService;
  let repo: Repository<Page>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: getRepositoryToken(Page),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    repo = module.get<Repository<Page>>(getRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('페이지를 생성할 수 있다.', async () => {
    const pageFixture = new Page({
      ownerId: 1,
      name: 'TEST_SCHOOL',
      region: 'seoul',
    });
    jest.spyOn(repo, 'create').mockReturnValue(pageFixture);
    jest.spyOn(repo, 'save').mockResolvedValue(pageFixture);
    expect(await service.create(pageFixture)).toBe(pageFixture);
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });
});
