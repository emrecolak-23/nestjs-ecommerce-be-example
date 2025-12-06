import { Product } from 'src/product/entities/product.entity';
import { VariantItems } from 'src/variant-items/entities/variant-items.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @ManyToOne(() => Product, (p) => p.variants)
  product: Product;

  @OneToMany(() => VariantItems, (item) => item.variant)
  items: VariantItems[];
}
