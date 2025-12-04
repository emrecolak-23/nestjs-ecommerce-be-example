import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AllowPermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  endpointId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAllow: boolean;
}
