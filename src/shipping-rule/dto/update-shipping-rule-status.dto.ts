import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateShippingRuleStatusDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
