import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PublishModule } from 'src/publish/publish.module';
import { PostModule } from 'src/post/post.module';
import { RedisModule } from 'src/database/redis.module';

@Module({
  imports: [PublishModule, PostModule, RedisModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
