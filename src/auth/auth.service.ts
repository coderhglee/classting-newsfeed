import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
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

  async validateUserById(id: string) {
    return this.usersService.findOne(id);
  }

  async validateUserByToken(token: string) {
    const tokenPayload = this.jwtService.decode(token) as TokenPayload;
    if (!tokenPayload) {
      return null;
    }
    return this.usersService.findOne(tokenPayload.userId);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { userName: user.name, userId: user.id } as TokenPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
