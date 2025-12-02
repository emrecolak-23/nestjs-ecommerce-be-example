import { Expose, Type } from 'class-transformer';
import { ResponseRoleDto } from 'src/role/dto';

export class ResponseUserDto {
  @Expose()
  id: number;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => ResponseRoleDto)
  role: ResponseRoleDto;
}
