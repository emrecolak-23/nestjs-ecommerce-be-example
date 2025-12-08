import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type SHIPPIN_RULE_TYPES = 'very fast' | 'fast' | 'normal';

@Entity()
export class ShippingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  type: SHIPPIN_RULE_TYPES;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  cost: number;

  @Column({ type: 'date' })
  estimateTime: Date;
}
