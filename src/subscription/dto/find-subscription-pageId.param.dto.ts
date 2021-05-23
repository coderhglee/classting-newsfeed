import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindSubscriptionPageIdParamDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly pageId: number;

  constructor(partial: Partial<FindSubscriptionPageIdParamDto>) {
    Object.assign(this, partial);
  }
}
