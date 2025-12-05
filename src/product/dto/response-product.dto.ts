import { Expose, Transform, Type } from 'class-transformer';
import { ResponseCategoryDto } from 'src/category/dto';
import { Product } from '../entities/product.entity';

export class ResponseProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  offerPrice: number;

  @Expose()
  shortDescription: string;

  @Expose()
  longDescription: string;

  @Expose()
  quantity: number;

  @Expose()
  categoryId: number;

  @Expose()
  @Transform(({ obj }: { obj: Product }) => obj?.category?.name)
  category: string;

  @Expose()
  slug: string;
}
