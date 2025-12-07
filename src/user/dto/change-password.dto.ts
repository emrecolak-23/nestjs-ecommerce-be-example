import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsStrongPassword()
  @IsNotEmpty()
  currentPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  confirmPassword: string;
}
