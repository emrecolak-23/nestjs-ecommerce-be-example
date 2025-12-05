import slugify from 'slugify';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Category, (c) => c.parent)
  parent: Category | null;

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
