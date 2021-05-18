import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageModule } from './../page/page.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), PageModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
