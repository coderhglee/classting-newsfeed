import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageModule } from './../page/page.module';
import { PublishModule } from '../publish/publish.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), PageModule, PublishModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
