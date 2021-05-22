import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindUserIdParamDto } from './dto/find-user-id.param.dto';
import { FindUserNameParamDto } from './dto/find-user-name.param.dto';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: FindUserIdParamDto) {
    return this.userService.findOne(param.id);
  }

  @Get('name/:name')
  findByName(@Param() param: FindUserNameParamDto) {
    return this.userService.findByName(param.name);
  }

  @Patch(':id')
  update(
    @Param() param: FindUserIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(param.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() param: FindUserIdParamDto) {
    return this.userService.remove(param.id);
  }
}
