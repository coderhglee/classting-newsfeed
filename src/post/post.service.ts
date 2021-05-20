import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from '../page/page.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PublishService } from 'src/publish/publish.service';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly pageService: PageService,
    private readonly publishService: PublishService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const page = await this.pageService.findById(createPostDto.pageId);
    const newPost = this.postRepository.create({
      ...createPostDto,
      page: page,
    });
    const savedPost = await this.postRepository.save(newPost);
    this.publishService.sendPost(page, savedPost.id);
    return savedPost;
  }

  async findOneByRelatedPage(id: number) {
    try {
      return await this.postRepository.findOneOrFail(id, {
        relations: ['page'],
      });
    } catch (error) {
      throw new BadRequestException(`Not Found User Cause ${error}`);
    }
  }

  findOne(id: number) {
    return this.postRepository.findOneOrFail(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOne(id);
      return await this.postRepository.save({ post, ...updatePostDto });
    } catch (err) {
      const message = `Post를 업데이트하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }
  }

  async remove(id: number) {
    try {
      const post = await this.findOne(id);
      return await this.postRepository.remove(post);
    } catch (err) {
      const message = `Post를 삭제하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }
  }
}
