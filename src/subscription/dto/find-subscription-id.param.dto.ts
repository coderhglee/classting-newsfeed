import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindSubscriptionIdParamDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;

  constructor(partial: Partial<FindSubscriptionIdParamDto>) {
    Object.assign(this, partial);
  }
}
