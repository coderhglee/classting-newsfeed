import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ enum: UserRole })
  readonly role: UserRole;
}
