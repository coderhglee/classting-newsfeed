import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Roles, RolesGuard } from './../auth/guard/roles.guard';

@Controller('page')
@UseGuards(RolesGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  create(@Request() req, @Body() createPageDto: CreatePageDto) {
    const loginUser = req.user.id;
    return this.pageService.create(loginUser, createPageDto);
  }
}
