import slugify from 'slugify';
import { Product } from 'src/product/entities/product.entity';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  //   @Column({ default: true })
  //   isActive: boolean;

  @DeleteDateColumn()
  deletedDate: Date;

  @ManyToOne(() => Category, (c) => c.children)
  parent: Category | null;

  @OneToMany(() => Category, (c) => c.parent)
  children: Category[];

  @OneToMany(() => Product, (c) => c.category)
  products: Product[];

  @Column()
  description: string;

  @Column()
  slug: string;

  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    this.slug = slugify(this.name, {
      strict: true,
      lower: true,
    });
  }
}
