import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
