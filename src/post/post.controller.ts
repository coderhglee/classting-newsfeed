import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { UserIsOwnerGuard } from './guards/user-is-owner.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindPostIdParamDto } from './dto/find-post-id.param.dto';

@ApiResponse({
  status: HttpStatus.OK,
  description: 'Success',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Not found',
})
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: '학교 페이지 내에 소식을 작성' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get(':id')
  findOne(@Param() param: FindPostIdParamDto) {
    return this.postService.findOneByRelatedPage(param.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: '학교 페이지 내에 소식을 수정' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Patch(':id')
  update(
    @Param() param: FindPostIdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(param.id, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: '학교 페이지 내에 소식을 삭제' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
  @Delete(':id')
  remove(@Param() param: FindPostIdParamDto) {
    return this.postService.remove(param.id);
  }
}
