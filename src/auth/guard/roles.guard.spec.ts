import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let roleGuard: RolesGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        Reflector,
        {
          provide: AuthService,
          useValue: {
            // decode: jest.fn(),
          },
        },
      ],
    }).compile();

    roleGuard = module.get<RolesGuard>(RolesGuard);
  });
  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });
});
