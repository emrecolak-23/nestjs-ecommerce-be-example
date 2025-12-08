import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
