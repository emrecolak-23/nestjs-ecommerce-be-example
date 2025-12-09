import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { EndpointService } from 'src/endpoint/endpoint.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesInterceptor implements NestInterceptor {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly permissionService: PermissionsService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    console.log('Authorization....');

    const request = context.switchToHttp().getRequest();
    const {
      method,
      currentUser,
      route: { path },
    } = request;

    if (!currentUser) return next.handle();

    const endpoint = await this.endpointService.findOne(path, method);
    const permission = await this.permissionService.findOne(currentUser.roleName, endpoint.id);

    if (!permission.isAllow) throw new ForbiddenException('You can not perform this action');

    return next.handle();
  }
}
