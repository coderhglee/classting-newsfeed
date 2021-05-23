import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindPostIdParamDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;

  constructor(partial: Partial<FindPostIdParamDto>) {
    Object.assign(this, partial);
  }
}
