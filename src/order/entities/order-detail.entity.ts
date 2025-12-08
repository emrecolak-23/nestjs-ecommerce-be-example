import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  orderId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  variant: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  variantPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;
}
