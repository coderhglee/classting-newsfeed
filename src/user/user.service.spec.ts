import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
    findOne: jest.fn(),
    update: jest.fn(),
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
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    expect(await service.create({ name: 'hglee' })).toEqual({
      id: expect.any(Number),
      name: 'hglee',
    });
  });

  it('should throw with message if not found user when find user', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    await expect(service.findOne(5)).rejects.toThrow('Not Found User');
  });

  it('should update a user', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1, name: 'hglee' });
    userRepository.update.mockResolvedValue({ id: 1, name: 'hglee_update' });
    expect(await service.update(1, { name: 'hglee_update' })).toEqual({
      id: expect.any(Number),
      name: 'hglee_update',
    });
  });

  it('should throw with message if not found user when update user', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    await expect(service.update(5, { name: 'hglee_update' })).rejects.toThrow(
      'User Update Error cause Error: Not Found User',
    );
  });

  it('should throw with message if not found user when remove user', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    await expect(service.remove(5)).rejects.toThrow(
      'User Remove Error cause Error: Not Found User',
    );
  });
});
