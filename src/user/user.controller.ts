import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ResponseUserDto } from './dto';
import { CurrentUser, Public, TransformDTO } from 'src/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @Public()
  @ApiOkResponse({
    type: ResponseUserDto,
    description: 'User created successfully',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('me')
  @ApiOkResponse({
    type: ResponseUserDto,
    description: 'Current user information',
  })
  async currentUser(@CurrentUser('id') userId: number) {
    return this.userService.findOneById(userId);
  }
}
