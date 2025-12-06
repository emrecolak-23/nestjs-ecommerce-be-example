import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Variant } from '../entities/variant.entity';
import { ResponseVariantItemDto } from 'src/variant-items/dto';

export class ResponseVariantDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  productId: number;

  @ApiProperty()
  @Transform(({ obj }: { obj: Variant }) => obj?.product?.name)
  @Expose()
  product: string;

  @ApiProperty()
  @Type(() => ResponseVariantItemDto)
  @Expose()
  items: ResponseVariantItemDto[];
}
