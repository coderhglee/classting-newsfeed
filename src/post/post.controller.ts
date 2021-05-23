import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { UserIsOwnerGuard } from './guards/user-is-owner.guard';
import { ApiTags } from '@nestjs/swagger';
import { FindPostIdParamDto } from './dto/find-post-id.param.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get(':id')
  findOne(@Param() param: FindPostIdParamDto) {
    return this.postService.findOneByRelatedPage(+param.id);
  }

  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Patch(':id')
  update(
    @Param() param: FindPostIdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+param.id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Delete(':id')
  remove(@Param() param: FindPostIdParamDto) {
    return this.postService.remove(+param.id);
  }
}
