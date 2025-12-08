import { IsIn, IsNotEmpty } from 'class-validator';
import type { Status } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

const OrderStatus = ['pending', 'success', 'cancel'];

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsIn(OrderStatus)
  @IsNotEmpty()
  status: Status;
}
