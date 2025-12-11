import { Body, Controller, Post } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/common';
import { ForgotPasswordDto, ResetPasswordDto } from 'src/user/dto';
import { PasswordRecoveryService } from 'src/user/password-recovery.service';

@Controller('password')
export class PaswordRecoveryController {
  constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

  @Post('/forgot')
  @ResponseMessage('Password reset link sent your email address')
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.passwordRecoveryService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset')
  @ResponseMessage('Password reset completed successfully')
  @Public()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.passwordRecoveryService.resetPassword(resetPasswordDto);
  }
}
