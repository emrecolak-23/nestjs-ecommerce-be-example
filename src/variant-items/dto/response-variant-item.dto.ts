import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VariantItems } from '../entities/variant-items.entity';

export class ResponseVariantItemDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  variantId: number;

  @ApiProperty()
  @Transform(({ obj }: { obj: VariantItems }) => obj?.variant?.name)
  @Expose()
  variant: string;
}
