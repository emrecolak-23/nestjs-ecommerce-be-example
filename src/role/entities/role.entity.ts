import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permissions[];

  @DeleteDateColumn()
  deletedDate: Date;
}
