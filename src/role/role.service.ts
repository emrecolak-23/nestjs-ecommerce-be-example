import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create({
      ...createRoleDto,
    });

    return this.roleRepository.save(role);
  }

  async getRole(name: string) {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: {
        users: true,
      },
    });

    if (!role) throw new NotFoundException(`No role ${name} found`);
    return role;
  }

  async findAll() {
    return await this.roleRepository.find({});
  }

  async updateRole(name: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.getRole(name);
    role.description = updateRoleDto.description;
    return this.roleRepository.save(role);
  }

  async removeRole(name: string) {
    const role = await this.getRole(name);

    if (role.users?.length > 0) throw new BadRequestException(`Cannot remove ${role.name} role`);

    return this.roleRepository.softRemove(role);
  }
}
