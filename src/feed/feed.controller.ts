import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SearchFeedDto } from './dto/search-feed.dto';
import { FeedService } from './feed.service';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req, @Query() { offset, limit }: SearchFeedDto) {
    return this.feedService.findNewsFeed(+offset, +limit, req.user);
  }
}
