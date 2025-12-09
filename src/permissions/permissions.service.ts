import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { AllowPermissionDto } from './dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

  async allow(allowPermissionDto: AllowPermissionDto) {
    const { roleName, endpointId, isAllow } = allowPermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: {
        roleName,
        endpointId,
      },
    });

    if (!permission)
      throw new BadRequestException(`
            ${roleName} and ${endpointId} has not permission
        `);

    permission.isAllow = isAllow;

    return this.permissionRepository.save(permission);
  }

  async findOne(roleName: string, endpointId: number) {
    const permission = await this.permissionRepository.findOne({
      where: {
        roleName,
        endpointId,
      },
    });

    if (!permission) throw new NotFoundException('Permission not found');

    return permission;
  }
}
