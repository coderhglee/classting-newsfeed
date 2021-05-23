import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserIdParamDto } from './dto/find-user-id.param.dto';
import { FindUserNameParamDto } from './dto/find-user-name.param.dto';

@ApiResponse({
  status: HttpStatus.OK,
  description: 'Success',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Not found',
})
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: '사용자 생성' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ description: '사용자 목록' })
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ description: '사용자 조회' })
  @Get(':id')
  findOne(@Param() param: FindUserIdParamDto) {
    return this.userService.findOne(param.id);
  }

  @ApiOperation({ description: '사용자 이름 조회' })
  @Get('name/:name')
  findByName(@Param() param: FindUserNameParamDto) {
    return this.userService.findByName(param.name);
  }

  @ApiOperation({ description: '사용자 수정' })
  @Patch(':id')
  update(
    @Param() param: FindUserIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(param.id, updateUserDto);
  }

  @ApiOperation({ description: '사용자 삭제' })
  @Delete(':id')
  remove(@Param() param: FindUserIdParamDto) {
    return this.userService.remove(param.id);
  }
}
