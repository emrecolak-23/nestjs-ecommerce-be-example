import { Expose, Transform, Type } from 'class-transformer';
import { ResponseProductDto } from 'src/product/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import { Variant } from '../entities/variant.entity';

export class ResponseVariantDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  productId: number;

  @ApiProperty()
  @Transform(({ obj }: { obj: Variant }) => obj?.product.name)
  @Expose()
  product: string;
}
