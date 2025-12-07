import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto, CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto';
import {
  CurrentUser,
  Public,
  ResponseMessage,
  TransformDTO,
  createApiResponseArrayDto,
  createApiResponseDto,
} from 'src/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/auth/types';

@ApiTags('Users')
@Controller('users')
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @Public()
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
    description: 'User created successfully',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('me')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
    description: 'Current user information',
  })
  async currentUser(@CurrentUser('id') userId: number) {
    return this.userService.findOneById(userId);
  }

  @Get('/')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseUserDto),
    description: 'All users information',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Patch('change-password')
  @ResponseMessage('Password changed successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
  })
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changeMyPassword(userId, changePasswordDto);
  }

  @Patch('change-information')
  @ResponseMessage('Password changed successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
  })
  async changeInformation(@CurrentUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(userId, updateUserDto);
  }

  @Get(':id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
    description: 'One user information',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  @ResponseMessage('User updated successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
    description: 'One user information',
  })
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('User deleted successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseUserDto),
    description: 'One user information',
  })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteOne(id);
  }
}
