import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Order } from '../entities/order.entity';

export class ResponseOrderDto {
  // Order Response

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  totalPrice: number;

  @ApiProperty()
  @Expose()
  orderStatus: string;

  @ApiProperty()
  @Expose()
  shippingAddress: string;

  @ApiProperty()
  @Expose()
  shippingMethod: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Transform(({ obj }: { obj: Order }) => obj?.user?.id)
  @Expose()
  userId: number;
}
