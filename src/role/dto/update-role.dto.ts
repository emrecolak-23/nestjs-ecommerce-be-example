import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  description: string;
}
