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
      isActive: true,
    });

    return this.roleRepository.save(role);
  }

  async getRole(name: string) {
    const role = await this.roleRepository.findOne({
      where: { name, isActive: true },
      relations: {
        users: true,
      },
    });

    if (!role) throw new NotFoundException(`No role ${name} found`);
    return role;
  }

  async findAll() {
    return await this.roleRepository.find({
      where: { isActive: true },
    });
  }

  async updateRole(name: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.getRole(name);
    role.description = updateRoleDto.description;
    return this.roleRepository.save(role);
  }

  async removeRole(name: string) {
    const role = await this.getRole(name);

    if (role.users?.length > 0) throw new BadRequestException(`Cannot remove ${role.name} role`);

    role.isActive = false;
    return this.roleRepository.save(role);
  }
}
