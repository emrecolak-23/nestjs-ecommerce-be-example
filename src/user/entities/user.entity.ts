import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { Role } from 'src/role/entities/role.entity';
import { ShippingAddress } from 'src/shipping-address/entities/shipping-address.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  @Exclude()
  password: string;

  @DeleteDateColumn()
  deletedDate: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => ShippingAddress, (address) => address.user)
  shippingAddress: ShippingAddress;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
