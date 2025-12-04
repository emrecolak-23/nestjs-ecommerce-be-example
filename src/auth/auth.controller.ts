import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpCode } from '@nestjs/common';
import { ResponseMessage } from 'src/common';
import { Public } from 'src/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  @ResponseMessage('User registered successfully')
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'User registered successfully',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User login successfully')
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'User logged in successfully',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
