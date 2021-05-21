import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SearchFeedDto } from './dto/search-feed.dto';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req, @Query() { offset, limit }: SearchFeedDto) {
    return this.feedService.findNewsFeed(+offset, +limit, req.user);
  }
}
