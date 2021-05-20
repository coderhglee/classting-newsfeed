import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { PostModule } from './post/post.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PublishModule } from './publish/publish.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PageModule,
    PostModule,
    SubscriptionModule,
    PublishModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
