import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  create(user: User, createPageDto: CreatePageDto) {
    const newPage = this.pageRepository.create({
      ...createPageDto,
      ownerId: user.id,
    });
    return this.pageRepository.save(newPage);
  }

  async findById(id: number) {
    try {
      return await this.pageRepository.findOneOrFail(id);
    } catch (error) {
      throw new BadRequestException(
        `페이지를 찾을수 없습니다. ID ${id} error ${error}`,
      );
    }
  }
}
