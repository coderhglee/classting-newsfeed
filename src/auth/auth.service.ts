import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByName(username);
    if (user && user.comparePassword(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
