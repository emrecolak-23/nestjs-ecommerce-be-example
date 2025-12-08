import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import type { SHIPPIN_RULE_TYPES } from '../entities/shipping-rule.entity';

export class ResponseShippingRuleDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  type: SHIPPIN_RULE_TYPES;

  @ApiProperty()
  @Expose()
  cost: number;

  @ApiProperty()
  @Expose()
  estimateDay: number;

  @ApiProperty()
  @Expose()
  status: boolean;
}
