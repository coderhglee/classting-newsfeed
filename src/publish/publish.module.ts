import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClient } from 'redis';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PublishEventStore } from './infra/publish-event-store';
import { REDIS_CLIENT } from './infra/publish-event.constants';
import { PublishService } from './publish.service';

@Module({
  imports: [SubscriptionModule, ConfigModule],
  providers: [
    PublishService,
    {
      useFactory: (configService: ConfigService): RedisClient => {
        return new RedisClient({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          retry_strategy: (options) => {
            if (options.error && options.error.code === 'ECONNREFUSED') {
              console.log('The server refused the connection');
            }

            if (options.error && options.error.code === 'CONNECTION_BROKEN') {
              console.log('The server refused the connection broken');
            }
            return Math.min(options.attempt * 100, 3000); //in ms
          },
        });
      },
      provide: REDIS_CLIENT,
      inject: [ConfigService],
    },
    PublishEventStore,
  ],
  exports: [PublishService, PublishEventStore],
})
export class PublishModule {}
