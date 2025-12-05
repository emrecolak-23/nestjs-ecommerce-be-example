import slugify from 'slugify';
import { Category } from 'src/category/entities/category.entity';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  longDescription: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  offerPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  slug: string;

  @ManyToOne(() => Category, (c) => c.products)
  category: Category;

  @DeleteDateColumn()
  deletedDate: Date;

  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    this.slug = slugify(this.name, {
      strict: true,
      lower: true,
    });
  }
}
