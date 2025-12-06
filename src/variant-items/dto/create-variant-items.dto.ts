import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  variantId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
