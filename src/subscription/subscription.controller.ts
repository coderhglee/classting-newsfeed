import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req) {
    const targetUser: User = req.user;
    return this.subscriptionService.findAllSubscribePage(targetUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':pageId')
  subscribePage(@Request() req, @Param('pageId') pageId: string) {
    const targetUser: User = req.user;
    return this.subscriptionService.subscribePage(+pageId, targetUser);
  }

  @Delete(':id')
  removeSubscribtion(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
