import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { PostModule } from './post/post.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PublishModule } from './publish/publish.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    PageModule,
    PostModule,
    SubscriptionModule,
    PublishModule,
    DatabaseModule,
    FeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
