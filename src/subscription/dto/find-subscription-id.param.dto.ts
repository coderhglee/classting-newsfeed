import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindSubscriptionIdParamDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  constructor(partial: Partial<FindSubscriptionIdParamDto>) {
    Object.assign(this, partial);
  }
}
