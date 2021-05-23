import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class SearchFeedDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
