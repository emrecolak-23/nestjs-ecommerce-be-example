import { Expose, Transform, Type } from 'class-transformer';
import { Product } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseVariantDto } from 'src/variant/dto';

export class ResponseProductDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  offerPrice: number;

  @ApiProperty()
  @Expose()
  shortDescription: string;

  @ApiProperty()
  @Expose()
  longDescription: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  categoryId: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: Product }) => obj?.category?.name)
  category: string;

  @ApiProperty()
  @Expose()
  @Type(() => ResponseVariantDto)
  variants: ResponseVariantDto[];

  @ApiProperty()
  @Expose()
  slug: string;
}
