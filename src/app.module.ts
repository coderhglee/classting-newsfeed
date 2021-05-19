import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { User } from './user/entities/user.entity';
import { Page } from './page/entities/page.entity';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      database: 'feed-db',
      entities: [User, Page, Post, Subscription],
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      keepConnectionAlive: true,
      retryAttempts: 2,
      retryDelay: 1000,
      logging: true,
    }),
    AuthModule,
    PageModule,
    PostModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private connection: Connection) {}
}
