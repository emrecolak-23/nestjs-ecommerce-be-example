import { Body, Controller, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AllowPermissionDto } from './dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('/allow')
  async allowPermission(@Body() allowPermissionDto: AllowPermissionDto) {
    return this.permissionsService.allow(allowPermissionDto);
  }
}
