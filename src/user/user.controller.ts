import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ResponseUserDto } from './dto';
import { CurrentUser, Public, TransformDTO } from 'src/common';

@Controller('users')
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @Public()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('me')
  async currentUser(@CurrentUser('id') userId: number) {
    return this.userService.findOneById(userId);
  }
}
