import { PublishEvent } from '../domain/publish-event';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './publish-event.constants';
import { PublishSearch } from '../domain/publish-search';
import { User } from 'src/user/entities/user.entity';

export class PublishEventStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClient,
  ) {}

  async publishEvent(targetEvent: PublishEvent) {
    await this.save(targetEvent);
  }

  private async save(event: PublishEvent): Promise<void> {
    const lPush = promisify(this.client.lpush).bind(this.client);
    await lPush(event.key, event.value).then(console.log).catch(console.log);
  }

  async getPublishedEvent(
    offset?: number,
    limit?: number,
    user?: User,
  ): Promise<string[]> {
    const lrange = promisify(this.client.lrange).bind(this.client);
    console.log(offset + limit);
    return lrange(user.id, offset, offset + limit)
      .then((posts) => {
        return posts;
      })
      .catch(console.error);
  }
}
