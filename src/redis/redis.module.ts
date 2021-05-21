import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClient } from 'redis';
import { REDIS_CLIENT } from 'src/publish/infra/publish-event.constants';

@Module({
  imports: [ConfigModule],
  providers: [
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
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
