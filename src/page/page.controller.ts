import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Roles, RolesGuard } from './../auth/guard/roles.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindPageIdParamDto } from './dto/find-page-id.param.dto';
import { UserRole } from 'src/user/entities/user.entity';

@ApiResponse({
  status: HttpStatus.OK,
  description: 'Success',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Not found',
})
@ApiTags('Page')
@Controller('page')
@UseGuards(RolesGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  create(@Request() req, @Body() createPageDto: CreatePageDto) {
    return this.pageService.create(req.user, createPageDto);
  }

  @Get(':id')
  findOne(@Param() param: FindPageIdParamDto) {
    return this.pageService.findById(param.id);
  }
}
