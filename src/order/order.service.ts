import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CartService } from 'src/cart/cart.service';
import { ProcessOrderDto, UpdateOrderStatusDto } from './dto';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { ShippingRuleService } from 'src/shipping-rule/shipping-rule.service';

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
      await this.cartService.clearAllICartItems(userId);
      return newOrder;
    });
  }

  async findOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        user: true,
        orderDetails: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.user.id !== userId) throw new UnauthorizedException('You can not update this order');

    return order;
  }

  async updateOrderStatus(
    userId: number,
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.findOrder(orderId, userId);
    console.log(order, 'orderr');
    order.orderStatus = updateOrderStatusDto.status;

    return this.orderRepository.save(order);
  }

  async findAll() {
    const orders = await this.orderRepository.find();

    return orders;
  }

  async findMyOrders(userId: number) {
    const orders = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    return orders;
  }

  async findOrderDetail(orderId: number) {
    const orderDetails = await this.orderDetailRepository.find({
      where: {
        order: { id: orderId },
      },
    });

    return orderDetails;
  }
}
