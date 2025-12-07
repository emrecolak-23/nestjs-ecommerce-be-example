import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

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

  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: User }) => obj?.role?.name)
  role: string;
}
