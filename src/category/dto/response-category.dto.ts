import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class ResponseCategoryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty({ type: () => ResponseCategoryDto })
  @Expose()
  @Type(() => ResponseCategoryDto)
  children: ResponseCategoryDto[];
}
