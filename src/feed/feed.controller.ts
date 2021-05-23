import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SearchFeedDto } from './dto/search-feed.dto';
import { FeedService } from './feed.service';

@ApiTags('Feed')
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
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req, @Query() { offset, limit }: SearchFeedDto) {
    return this.feedService.findNewsFeed(+offset, +limit, req.user);
  }
}
