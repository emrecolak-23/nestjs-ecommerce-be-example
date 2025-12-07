import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CartItemDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  price: number;
  @ApiProperty()
  @Expose()
  quantity: number;
  @ApiProperty()
  @Expose()
  variant: string;
  @ApiProperty()
  @Expose()
  totalPrice: number;
}

export class ResponseCartDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  totalPrice: number;

  @Expose()
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
