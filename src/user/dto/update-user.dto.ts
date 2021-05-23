import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly roles: string[];
}
