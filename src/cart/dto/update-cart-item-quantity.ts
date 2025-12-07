import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
