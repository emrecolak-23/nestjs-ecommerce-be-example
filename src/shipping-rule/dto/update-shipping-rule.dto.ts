import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateShippingRuleDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cost: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  estimateDay: number;
}
