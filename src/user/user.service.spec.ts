import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

const userListFixtures = [
  new User('user_1'),
  new User('user_2'),
  new User('user_3'),
];

const userFixtures = new User('user_1');

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue(userListFixtures),
    findOneOrFail: jest.fn().mockResolvedValue(userFixtures),
    create: jest.fn().mockReturnValue(userFixtures),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userListFixtures);
    });
  });

  describe('findOne', () => {
    it('should get a single user', () => {
      expect(service.findOne(1)).resolves.toEqual(userFixtures);
    });

    it('should throw with message if not found user when find user', async () => {
      jest
        .spyOn(repo, 'findOneOrFail')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      await expect(service.findOne(1)).rejects.toThrowError(
        'Not Found User Cause Error: Bad Delete Method.',
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repo, 'save').mockResolvedValue(userFixtures);
      expect(await service.create({ name: 'hglee' })).toEqual(userFixtures);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: 1, name: 'hglee' });
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue({ id: 1, name: 'hglee_update' });
      expect(await service.update(1, { name: 'hglee_update' })).toEqual({
        id: expect.any(Number),
        name: 'hglee_update',
      });
    });

    it('should throw with message if not found user when update user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Not Found User'));
      await expect(
        service.update(1, { name: 'hglee_update' }),
      ).rejects.toThrowError('Not Found User');
    });
  });

  describe('remove', () => {
    it('should throw with message if not found user when remove user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Not Found User'));
      await expect(service.remove(1)).rejects.toThrow('Not Found User');
    });
  });
});
