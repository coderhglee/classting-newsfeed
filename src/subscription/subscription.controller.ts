import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { FindSubscriptionIdParamDto } from './dto/find-subscription-id.param.dto';
import { FindSubscriptionPageIdParamDto } from './dto/find-subscription-pageId.param.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscription')
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
  subscribePage(
    @Request() req,
    @Param() param: FindSubscriptionPageIdParamDto,
  ) {
    const targetUser: User = req.user;
    return this.subscriptionService.subscribePage(param.pageId, targetUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeSubscribtion(
    @Request() req,
    @Param() param: FindSubscriptionIdParamDto,
  ) {
    const targetUser: User = req.user;
    return this.subscriptionService.remove(param.id, targetUser);
  }
}
