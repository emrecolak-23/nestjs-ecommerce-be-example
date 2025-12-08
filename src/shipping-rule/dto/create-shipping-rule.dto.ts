import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import type { SHIPPIN_RULE_TYPES } from '../entities/shipping-rule.entity';
import { ApiProperty } from '@nestjs/swagger';

const SHIPPING_TYPES = ['very fast', 'fast', 'normal'] as const;

export class CreateShippingRuleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(SHIPPING_TYPES, { message: 'Type must be one of: very fast, fast, normal' })
  type: SHIPPIN_RULE_TYPES;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estimateDay: number;
}
