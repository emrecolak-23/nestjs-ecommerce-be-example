import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  type: string; // "order" | "auth"

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;
}
