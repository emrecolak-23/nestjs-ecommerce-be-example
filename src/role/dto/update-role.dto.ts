import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  description: string;
}
