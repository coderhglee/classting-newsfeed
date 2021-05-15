import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const multiUserFixture = [
  {
    id: 1,
    name: 'user_1',
  },
  {
    id: 2,
    name: 'user_2',
  },
  {
    id: 3,
    name: 'user_3',
  },
];

const singleUserFixture = {
  id: 1,
  name: 'user_1',
};

describe('UserController', () => {
  let controller: UserController;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
    findAll: jest.fn().mockReturnValue(multiUserFixture),
    findOne: jest.fn().mockReturnValue(singleUserFixture),
    remove: jest.fn().mockReturnValue(singleUserFixture),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { name: 'user_1' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all user', () => {
    expect(controller.findAll()).toEqual(multiUserFixture);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should find single user', () => {
    expect(controller.findOne('1')).toEqual(singleUserFixture);
    expect(mockUsersService.findOne).toHaveBeenCalled();
  });

  it('should update a user', () => {
    const dto = { name: 'hglee' };

    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalled();
  });

  it('should remove user by id', () => {
    expect(controller.remove('1')).toEqual(singleUserFixture);
    expect(mockUsersService.remove).toHaveBeenCalled();
  });
});
