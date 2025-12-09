import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto, CreateCartDto, UpdateCartItemQuantityDto } from './dto';
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

  async findCartByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) throw new BadRequestException('No cart for this user');

    return cart;
  }

  async addItemToCart(userId: number, addToCartDto: AddToCartDto) {
    const { quantity, variantItemId, productId } = addToCartDto;
    // const product = await this.productService.findOneById(productId);
    // const cart = await this.findCartByUserId(userId);
    // const variantItem = await this.variantItemService.findOne(variantItemId);

    const [product, cart, variantItem] = await Promise.all([
      this.productService.findOneById(productId),
      this.findCartByUserId(userId),
      this.variantItemService.findOne(variantItemId),
    ]);

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
        await this.cartItemRepository.save(existingCartItem);
      }
    } else {
      const cartItem = this.cartItemRepository.create({
        cart: { id: cart.id },
        product: { id: product.id },
        price: product.price,
        quantity: quantity,
        variant: JSON.stringify(variant),
        totalPrice: totalPrice,
      });

      await this.cartItemRepository.save(cartItem);
    }

    await this.reCalculateCartTotalPrice(userId);
  }

  async updateQuantity(
    userId: number,
    cartItemId: number,
    updateCartItemDto: UpdateCartItemQuantityDto,
  ) {
    if (updateCartItemDto.quantity === 0) {
      await this.removeItemFromCart(userId, cartItemId);
      return;
    }

    const cartItem = await this.findOneCartItem(cartItemId);
    const cart = await this.findCartByUserId(userId);

    if (cartItem.cart.id !== cart.id)
      throw new UnauthorizedException('You can not update this cart item');

    cartItem.quantity = updateCartItemDto.quantity;
    cartItem.totalPrice =
      parseFloat(`${cartItem.price}`) * updateCartItemDto.quantity +
      JSON.parse(cartItem.variant).price * updateCartItemDto.quantity;

    console.log(cartItem, 'cartItem');

    await this.cartItemRepository.save(cartItem);
    await this.reCalculateCartTotalPrice(userId);
  }

  private async reCalculateCartTotalPrice(userId: number) {
    const cart = await this.findCartByUserId(userId);
    const cartItems = await this.cartItemRepository.find({
      where: {
        cart: cart,
      },
    });
    console.log(cartItems);
    const cartTotalPrice = cartItems.reduce((acc, curr) => {
      return parseFloat(`${curr.totalPrice}`) + acc;
    }, 0);
    console.log(cartTotalPrice, 'cartTotalPrice');
    cart.totalPrice = cartTotalPrice;
    await this.cartRepository.save(cart);
  }

  async findOneCartItem(cartItemId: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: {
        cart: true,
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    return cartItem;
  }

  async removeItemFromCart(userId: number, cartItemId: number) {
    const cartItem = await this.findOneCartItem(cartItemId);
    const cart = await this.findCartByUserId(userId);

    if (cartItem.cart.id !== cart.id)
      throw new UnauthorizedException('You can not delete this cart item');

    await this.cartItemRepository.remove(cartItem);
    await this.reCalculateCartTotalPrice(userId);
  }

  async clearAllICartItems(userId: number) {
    const cart = await this.findCartByUserId(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }
}
