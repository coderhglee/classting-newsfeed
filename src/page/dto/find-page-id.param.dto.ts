import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindPageIdParamDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  constructor(partial: Partial<FindPageIdParamDto>) {
    Object.assign(this, partial);
  }
}
