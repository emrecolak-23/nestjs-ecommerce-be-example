import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto, ProcessOrderDto } from './dto';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { ShippingRuleService } from 'src/shipping-rule/shipping-rule.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    private readonly cartService: CartService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly shippingRuleService: ShippingRuleService,
  ) {}

  async process(userId: number, processOrderDto: ProcessOrderDto) {
    const [address, rule, cart] = await Promise.all([
      this.shippingAddressService.findOne(processOrderDto.shippingAddressId),
      this.shippingRuleService.findOne(processOrderDto.shippingRuleId),
      this.cartService.findCartByUserId(userId),
    ]);

    if (address.user.id !== userId) {
      throw new UnauthorizedException('Please use another address');
    }

    const shippingAddressInfo = {
      id: address.id,
      value: address.value,
      phoneNumber: address.phoneNumber,
    };

    return await this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
      const order = new Order();
      order.shippingAddress = JSON.stringify(shippingAddressInfo);
      order.shippingMethod = JSON.stringify(rule);
      order.user = { id: userId } as any;

      const newOrder = await transactionalEntityManager.save(Order, order);

      const orderDetails = cart.items.map((cartItem) => {
        const orderDetail = new OrderDetail();
        orderDetail.order = { id: newOrder.id } as any;
        orderDetail.product = cartItem.product;
        orderDetail.productName = cartItem.product.name;
        orderDetail.productPrice = cartItem.product.price;
        orderDetail.quantity = cartItem.quantity;
        orderDetail.variant = cartItem.variant;
        orderDetail.totalPrice = cartItem.totalPrice;
        return orderDetail;
      });

      await transactionalEntityManager.save(OrderDetail, orderDetails);

      const totalOrderPrice = orderDetails.reduce((acc, cur) => {
        return parseFloat(`${cur.totalPrice}`) + acc;
      }, 0);

      newOrder.totalPrice = totalOrderPrice;
      await transactionalEntityManager.save(Order, newOrder);

      return newOrder;
    });
  }

  create(createOrderDto: CreateOrderDto) {}
}
