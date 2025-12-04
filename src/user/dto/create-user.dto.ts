import { IsEmail, IsStrongPassword, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: string;
}
