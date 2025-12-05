import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, ResponseRoleDto, UpdateRoleDto } from './dto';
import { Public, TransformDTO, createApiResponseDto, createApiResponseArrayDto } from 'src/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('role')
@TransformDTO(ResponseRoleDto)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/')
  @Public()
  @ApiOkResponse({
    type: createApiResponseDto(ResponseRoleDto),
    description: 'Role created successfully',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseRoleDto),
    description: 'List of all roles',
  })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':name')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseRoleDto),
    description: 'Role found',
  })
  async getRole(@Param('name') name: string) {
    return this.roleService.getRole(name);
  }

  @Patch(':name')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseRoleDto),
    description: 'Role updated successfully',
  })
  async updateRole(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(name, updateRoleDto);
  }

  @Delete(':name')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseRoleDto),
    description: 'Role deleted successfully',
  })
  async removeRole(@Param('name') name: string) {
    return this.roleService.removeRole(name);
  }
}
