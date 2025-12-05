import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const parentCategory = createCategoryDto.parentId
      ? await this.categoryRepository.findOne({
          where: { id: createCategoryDto.parentId },
        })
      : null;

    const category = new Category();
    category.parent = parentCategory ? parentCategory : null;
    Object.assign(category, createCategoryDto);

    return this.categoryRepository.save(category);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: {
        children: {
          children: true,
        },
      },
    });

    console.log(categories[0].children[1], 'categories');

    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        children: true,
      },
    });

    console.log(category, 'category');

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async updateOne(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = (await this.findOne(id)) as Category;

    Object.assign(existingCategory, updateCategoryDto);

    return this.categoryRepository.save(existingCategory);
  }

  async deleteOne(id: number) {
    const existingCategory = (await this.findOne(id)) as Category;
    return this.categoryRepository.softRemove(existingCategory);
  }
}
