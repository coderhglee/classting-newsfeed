import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const multiUserFixture = [
  new User({ name: 'user_1', password: 'password', roles: ['admin', 'user'] }),
  new User({ name: 'user_2', password: 'password', roles: ['admin', 'user'] }),
  new User({ name: 'user_3', password: 'password', roles: ['admin', 'user'] }),
];

const singleUserFixture = new User({
  name: 'user_1',
  password: 'password',
  roles: ['admin', 'user'],
});

const mockUserRepository = {
  find: jest.fn().mockResolvedValue(multiUserFixture),
  findOne: jest.fn().mockResolvedValue(singleUserFixture),
  create: jest.fn().mockReturnValue(singleUserFixture),
  save: jest.fn().mockResolvedValue(singleUserFixture),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

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
      expect(users).toEqual(multiUserFixture);
    });
  });

  describe('findOne', () => {
    it('should get a single user', async () => {
      await expect(service.findOne('uuid')).resolves.toEqual(singleUserFixture);
    });

    it('should throw with message if not found user when find user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('uuid')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      expect(await service.create(singleUserFixture)).toEqual(
        singleUserFixture,
      );
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUser = new User({
        name: 'user_1_update',
        password: 'password',
        roles: ['admin', 'user'],
      });
      jest.spyOn(service, 'findOne').mockResolvedValue(singleUserFixture);
      jest.spyOn(repo, 'save').mockResolvedValue(updateUser);
      expect(await service.update('uuid', { name: updateUser.name })).toEqual(
        updateUser,
      );
      expect(service.findOne).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw with message if not found user when update user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Not Found User'));
      await expect(
        service.update('uuid', { name: 'hglee_update' }),
      ).rejects.toThrowError('Not Found User');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should throw with message if not found user when remove user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Not Found User'));
      await expect(service.remove('uuid')).rejects.toThrow('Not Found User');
    });
  });
});
