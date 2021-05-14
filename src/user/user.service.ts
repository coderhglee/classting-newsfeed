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

  findOne(id: number) {
    return this.userRepository.findOne(id).then((user) => {
      if (!user) {
        throw new Error(`Not Found User`);
      }
      return user;
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.findOne(id)
      .then(() => {
        return this.userRepository.update(id, updateUserDto);
      })
      .catch((err) => {
        throw new Error(`User Update Error cause ${err}`);
      });
  }

  remove(id: number) {
    return this.findOne(id)
      .then(() => {
        return this.userRepository.delete(id);
      })
      .catch((err) => {
        throw new Error(`User Remove Error cause ${err}`);
      });
  }
}
