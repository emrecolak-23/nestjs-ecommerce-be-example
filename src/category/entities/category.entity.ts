import slugify from 'slugify';
import { AfterUpdate, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

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
