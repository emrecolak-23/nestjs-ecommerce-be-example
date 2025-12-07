import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  // @IsNumber()
  // @IsNotEmpty()
  // price: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  variantItemId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;
}
