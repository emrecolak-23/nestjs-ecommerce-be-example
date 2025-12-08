import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  // @IsNumber()
  // @IsNotEmpty()
  // price: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  variantItemId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
