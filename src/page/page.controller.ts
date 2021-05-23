import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Roles, RolesGuard } from './../auth/guard/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { FindPageIdParamDto } from './dto/find-page-id.param.dto';

@ApiTags('Page')
@Controller('page')
@UseGuards(RolesGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  create(@Request() req, @Body() createPageDto: CreatePageDto) {
    return this.pageService.create(req.user, createPageDto);
  }

  @Get(':id')
  findOne(@Param() param: FindPageIdParamDto) {
    return this.pageService.findById(param.id);
  }
}
