import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseRoleDto } from 'src/role/dto';

export class ResponseUserDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  lastname: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ type: () => ResponseRoleDto })
  @Expose()
  @Type(() => ResponseRoleDto)
  role: ResponseRoleDto;
}
