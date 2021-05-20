import { PublishEvent } from '../domain/publish-event';
import { RedisClient } from 'redis';
import { promisify } from 'util';

export class PublishEventStore {
  private readonly client: RedisClient;

  constructor() {
    this.client = new RedisClient({});
  }

  async publishPost(targetEvent: PublishEvent) {
    await this.getPublishedEvent(targetEvent.key).then((existEvent) => {
      if (!existEvent) {
        this.save(targetEvent);
        return;
      }
      this.merge(existEvent, targetEvent);
    });
  }

  async save(event: PublishEvent): Promise<void> {
    await this.client.set(event.key, JSON.stringify(event));
  }

  async merge(
    existEvent: PublishEvent,
    targetEvent: PublishEvent,
  ): Promise<void> {
    await this.save({
      key: existEvent.key,
      value: existEvent.value.concat(targetEvent.value),
    });
  }

  async getPublishedEvent(userId: string): Promise<PublishEvent> {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync.then(console.log).catch(console.error);
    // .then((result: string) => {
    //   return JSON.parse(result);
    // })
    // .catch(() => {
    //   return null;
    // })
  }

  // private failToConnectRedis(error: Error): Promise<void> {
  //   console.error(error);
  //   process.exit(1);
  // }
}
