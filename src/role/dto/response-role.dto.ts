import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseRoleDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;
}
