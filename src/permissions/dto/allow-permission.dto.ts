import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AllowPermissionDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsNumber()
  @IsNotEmpty()
  endpointId: number;

  @IsBoolean()
  @IsNotEmpty()
  isAllow: boolean;
}
