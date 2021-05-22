import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    return this.postRepository
      .save(newPost)
      .then((savedPost) => {
        this.publishService.publishPost(page, savedPost.id);
        return savedPost;
      })
      .catch(() => {
        throw new BadRequestException(`Post를 생성하는데 실패하였습니다.`);
      });
  }

  async findOneByRelatedPage(id: number) {
    const postById = await this.postRepository.findOne(id, {
      relations: ['page'],
    });
    if (!postById) {
      throw new NotFoundException(`Post를 찾는데 실패하였습니다 ID: ${id}`);
    }
    return postById;
  }

  async findOne(id: number) {
    const postById = await this.postRepository.findOne(id);
    if (!postById) {
      throw new NotFoundException(`Post를 찾는데 실패하였습니다 ID: ${id}`);
    }
    return postById;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const postById = await this.findOne(id);
    return this.postRepository
      .save({ post: postById, ...updatePostDto })
      .catch((err) => {
        const message = `Post를 업데이트하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      });
  }

  async remove(id: number) {
    const postById = await this.findOneByRelatedPage(id);
    return this.postRepository
      .softRemove(postById)
      .then(async (removedPost) => {
        await this.publishService.removePublishedPost(removedPost);
        return removedPost;
      })
      .catch((err) => {
        const message = `Post를 삭제하는데 실패 하였습니다. ID: ${id} exception: ${err}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      });
  }
}
