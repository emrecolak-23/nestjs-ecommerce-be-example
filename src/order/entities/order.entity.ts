import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';

export type Status = 'pending' | 'success' | 'cancel';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ default: 'pending' })
  orderStatus: Status;

  @Column({ type: 'text' })
  shippingAddress: string;

  @Column({ type: 'text' })
  shippingMethod: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  orderDetails: OrderDetail[];
}
