import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindPostIdParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;

  constructor(partial: Partial<FindPostIdParamDto>) {
    Object.assign(this, partial);
  }
}
