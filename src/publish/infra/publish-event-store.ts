import { PublishEvent } from '../domain/publish-event';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './publish-event.constants';

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

  async getPublishedEvent(userId: string): Promise<PublishEvent> {
    const get = promisify(this.client.get).bind(this.client);
    return get(userId)
      .then((posts) => {
        return posts;
      })
      .catch(console.error);
  }
}
