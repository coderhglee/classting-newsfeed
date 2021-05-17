import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  create(id: number, createPageDto: CreatePageDto) {
    const newPage = this.pageRepository.create({
      ...createPageDto,
      ownerId: id,
    });
    return this.pageRepository.save(newPage);
  }
}
