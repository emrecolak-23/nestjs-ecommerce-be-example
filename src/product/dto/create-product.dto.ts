import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  offerPrice: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(0, 255)
  shortDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longDescription: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
