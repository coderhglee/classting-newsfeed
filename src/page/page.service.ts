import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  create(createPageDto: CreatePageDto) {
    const newPage = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(newPage);
  }
}
