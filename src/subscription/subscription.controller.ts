import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { FindSubscriptionIdParamDto } from './dto/find-subscription-id.param.dto';
import { FindSubscriptionPageIdParamDto } from './dto/find-subscription-pageId.param.dto';
import { SubscriptionService } from './subscription.service';

@ApiResponse({
  status: HttpStatus.OK,
  description: 'Success',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Not found',
})
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: '구독 중인 학교 페이지 목록 확인' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req) {
    const targetUser: User = req.user;
    return this.subscriptionService.findAllSubscribePage(targetUser);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: '학교 페이지 구독' })
  @UseGuards(JwtAuthGuard)
  @Get(':pageId')
  subscribePage(
    @Request() req,
    @Param() param: FindSubscriptionPageIdParamDto,
  ) {
    const targetUser: User = req.user;
    return this.subscriptionService.subscribePage(param.pageId, targetUser);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: '학교 페이지 구독 취소' })
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
