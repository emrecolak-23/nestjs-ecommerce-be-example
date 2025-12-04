import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, ResponseRoleDto, UpdateRoleDto } from './dto';
import { Public, TransformDTO } from 'src/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('role')
@TransformDTO(ResponseRoleDto)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/')
  @Public()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':name')
  async getRole(@Param('name') name: string) {
    return this.roleService.getRole(name);
  }

  @Patch(':name')
  async updateRole(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(name, updateRoleDto);
  }

  @Delete(':name')
  async removeRole(@Param('name') name: string) {
    return this.roleService.removeRole(name);
  }
}
