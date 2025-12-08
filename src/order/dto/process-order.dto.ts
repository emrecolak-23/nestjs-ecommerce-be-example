import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class ProcessOrderDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  shippingAddressId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  shippingRuleId: number;
}
