import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordChangeRequest {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  currentTime: Date;

  @ManyToOne(() => User)
  user: User;
}
