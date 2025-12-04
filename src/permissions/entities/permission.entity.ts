import { Endpoint } from 'src/endpoint/entities/endpoint.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  roleName: string;

  @PrimaryColumn()
  endpointId: number;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'roleName' })
  role: Role;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.permissions)
  @JoinColumn({ name: 'endpointId' })
  endpoint: Endpoint;

  @Column({ default: false })
  isAllow: boolean;
}
