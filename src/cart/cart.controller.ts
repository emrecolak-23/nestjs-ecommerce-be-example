import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { createApiResponseDto, CurrentUser, ResponseMessage, TransformDTO } from 'src/common';
import { AddToCartDto } from './dto';
import { ResponseCartDto } from './dto/response-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('carts')
@TransformDTO(ResponseCartDto)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseCartDto),
  })
  getMyCart(@CurrentUser('id') userId: number) {
    return this.cartService.findCartByUserId(userId);
  }

  @Post('add-to-cart')
  @ResponseMessage('Product added into cart successfully')
  addToCart(@CurrentUser('id') userId: number, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItemToCart(userId, addToCartDto);
  }

  @Delete('items/:cartItemId')
  @ResponseMessage('Cart Item deleted successfully')
  removeFromCart(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.cartService.removeItemFromCart(userId, cartItemId);
  }
}
