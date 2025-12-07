import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto, CreateCartDto } from './dto';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { VariantItemsService } from 'src/variant-items/variant-items.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly variantItemService: VariantItemsService,
  ) {}

  create(user: User) {
    const cart = new Cart();
    cart.user = user;
    return this.cartRepository.save(cart);
  }

  async findCart(userId: number) {
    const user = await this.userService.findOneById(userId);

    const cart = await this.cartRepository.findOne({
      where: {
        user: user,
      },
    });

    if (!cart) throw new BadRequestException('No cart for this user');

    return cart;
  }

  async addItemToCart(userId: number, addToCartDto: AddToCartDto) {
    const { quantity, variantItemId, productId } = addToCartDto;
    const product = await this.productService.findOneById(productId);
    const cart = await this.findCart(userId);
    const variantItem = await this.variantItemService.findOne(variantItemId);
    const variant = {
      itemId: variantItem.id,
      variant: variantItem.variant.name,
      price: parseFloat(`${variantItem.price}`),
      value: variantItem.value,
    };
    const totalPrice = product.price * quantity + variant.price * quantity;

    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        product,
      },
    });

    if (existingCartItem) {
      const parsedVariant = JSON.parse(existingCartItem.variant);
      if (parsedVariant.itemId === variant.itemId) {
        existingCartItem.quantity += quantity;
        existingCartItem.totalPrice = parseFloat(`${existingCartItem.totalPrice}`) + totalPrice;
        return this.cartItemRepository.save(existingCartItem);
      }
    }

    const cartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.price = product.price;
    cartItem.quantity = quantity;
    cartItem.variant = JSON.stringify(variant);
    cartItem.totalPrice = totalPrice;

    return this.cartItemRepository.save(cartItem);
  }
}
