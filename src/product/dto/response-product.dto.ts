import { Expose, Type } from 'class-transformer';
import { ResponseCategoryDto } from 'src/category/dto';

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
  @Type(() => ResponseCategoryDto)
  category: ResponseCategoryDto;
}
