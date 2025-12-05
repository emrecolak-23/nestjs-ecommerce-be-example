import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    const category = this.categoryRepository.findOne({
      where: { id },
    });

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
