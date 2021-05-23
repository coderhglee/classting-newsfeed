import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindPostIdParamDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  constructor(partial: Partial<FindPostIdParamDto>) {
    Object.assign(this, partial);
  }
}
