import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from '../page/page.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly pageService: PageService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    this.pageService.findById(createPostDto.pageId).then((page) => {
      return this.postRepository.save({
        ...createPostDto,
        page: page,
      });
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return this.postRepository.findOneOrFail(id, { relations: ['page'] });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
