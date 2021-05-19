import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './../../user/entities/user.entity';
import { PageService } from './../../page/page.service';

@Injectable()
export class UserIsOwnerGuard implements CanActivate {
  constructor(private readonly pageService: PageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const body = request.body;
    const pageId: number = body.pageId as number;
    const user: User = request.user;

    const page = await this.pageService.findById(pageId);
    if (page.isPageOwner(user.id)) {
      return true;
    }
    throw new UnauthorizedException('해당 Page의 권한이 없습니다.');
  }
}
