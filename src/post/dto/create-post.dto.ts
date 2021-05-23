import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  pageId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  context: string;

  constructor(partial: Partial<CreatePostDto>) {
    Object.assign(this, partial);
  }
}
