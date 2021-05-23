import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return {
            name: 'default',
            type: 'sqlite',
            database: ':memory:',
            keepConnectionAlive: true,
            logging: true,
            synchronize: true,
            dropSchema: true,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          };
        }
        return {
          type: 'mysql',
          host: config.get('DATABASE_HOST') || 'localhost',
          database: config.get('MYSQL_DATABASE') || 'feed',
          username: config.get('MYSQL_USER_NAME') || 'root',
          password: config.get('MYSQL_ROOT_PASSWORD') || 'root',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          keepConnectionAlive: true,
          retryAttempts: 2,
          retryDelay: 1000,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
