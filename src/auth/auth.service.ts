import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from './../user/user.service';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByName(username);
    if (user && user.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async validateUserById(id: number) {
    return this.usersService.findOne(id);
  }

  login(user: User) {
    const payload = { userName: user.name, userId: user.id } as TokenPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
