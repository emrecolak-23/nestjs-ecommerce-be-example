import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser, ResponseMessage, TransformDTO } from 'src/common';
import { AddToCartDto } from './dto';
import { ResponseCartDto } from './dto/response-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @TransformDTO(ResponseCartDto)
  @ResponseMessage('Product added into cart successfully')
  addToCart(@CurrentUser('id') userId: number, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItemToCart(userId, addToCartDto);
  }
}
