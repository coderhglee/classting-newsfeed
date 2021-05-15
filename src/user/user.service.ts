import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneOrFail(id);
    } catch (error) {
      throw new Error(`Not Found User Cause ${error}`);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.findOne(id)
      .then((user) => {
        const updateUser = { ...user, ...updateUserDto };
        return this.userRepository.save(updateUser);
      })
      .catch((err) => {
        throw new Error(`User Update Error cause ${err}`);
      });
  }

  remove(id: number) {
    return this.findOne(id)
      .then((user) => {
        return this.userRepository.remove(user);
      })
      .catch((err) => {
        throw new Error(`User Remove Error cause ${err}`);
      });
  }
}
