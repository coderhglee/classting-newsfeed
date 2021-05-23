import { Inject, Injectable } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { PublishEventStore } from 'src/publish/infra/publish-event-store';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FeedService {
  constructor(
    private readonly postService: PostService,
    @Inject('PublishEventStore')
    private readonly eventStore: PublishEventStore,
  ) {}

  async findNewsFeed(offset?: number, limit?: number, user?: User) {
    return this.eventStore
      .getPublishedEvent(offset, limit, user)
      .then((result) =>
        Promise.all(result.map((postId) => this.postService.findOne(+postId))),
      );
  }
}
