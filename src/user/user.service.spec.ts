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
    it('사용자 리스트를 반환한다.', async () => {
      const users = await service.findAll();
      expect(users).toEqual(multiUserFixture);
    });
  });

  describe('findOne', () => {
    it('단일 사용자를 조회 가능하다', async () => {
      await expect(service.findOne('uuid')).resolves.toEqual(singleUserFixture);
    });

    it('존재하지 않는 사용자를 조회했을때 에러를 반환한다.', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('uuid')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('사용자를 생성할 수 있다.', async () => {
      expect(await service.create(singleUserFixture)).toEqual(
        singleUserFixture,
      );
      expect(repo.save).toHaveBeenCalled();
    });

    it('사용자 생성에 실파하면 에러를 반환한다.', async () => {
      jest.spyOn(repo, 'save').mockRejectedValue(Error);
      await expect(service.create(singleUserFixture)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('사용자를 수정할 수 있다.', async () => {
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

    it('사용자를 수정하는데 실패하면 에러를 반환한다', async () => {
      jest.spyOn(repo, 'update').mockRejectedValue(Error);
      await expect(
        service.update('uuid', { name: 'hglee_update' }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('사용자를 삭제하는데 실패하면 에러를 반환한다', async () => {
      jest.spyOn(repo, 'remove').mockRejectedValue(Error);
      await expect(service.remove('uuid')).rejects.toThrow(BadRequestException);
    });
  });
});
