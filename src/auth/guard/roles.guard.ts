import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    let token = request.headers.authorization;

    if (/Bearer/.test(token)) {
      token = token.split(' ').pop();
    }

    const user = await this.authService.validateUserByToken(token);

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.hasRole(role));
  }
}
