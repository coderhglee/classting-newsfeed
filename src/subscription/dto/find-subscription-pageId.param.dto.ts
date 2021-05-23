import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindSubscriptionPageIdParamDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  readonly pageId: number;

  constructor(partial: Partial<FindSubscriptionPageIdParamDto>) {
    Object.assign(this, partial);
  }
}
