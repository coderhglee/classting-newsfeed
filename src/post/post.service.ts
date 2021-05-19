import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from '../page/page.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly pageService: PageService,
  ) {}
  create(createPostDto: CreatePostDto) {
    return this.pageService.findById(createPostDto.pageId).then((page) => {
      const newPost = this.postRepository.create({
        ...createPostDto,
        page: page,
      });
      return this.postRepository.save(newPost);
    });
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.findOne(id)
      .then((post) => {
        return this.postRepository.save({ post, ...updatePostDto });
      })
      .catch((err) => {
        const message = `Post를 업데이트하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      });
  }

  remove(id: number) {
    return this.findOne(id)
      .then((post) => {
        return this.postRepository.remove(post);
      })
      .catch((err) => {
        const message = `Post를 삭제하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      });
  }
}
