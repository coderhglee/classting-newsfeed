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
  async create(createPostDto: CreatePostDto) {
    return this.pageService.findById(createPostDto.pageId).then((page) => {
      return this.postRepository.save({
        ...createPostDto,
        page: page,
      });
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOneByRelatedPage(id: number) {
    return this.postRepository.findOneOrFail(id, { relations: ['page'] });
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
    return `This action removes a #${id} post`;
  }
}
