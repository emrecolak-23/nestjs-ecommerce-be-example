import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CACHE_TTL } from 'src/common';

@Injectable()
export class CategoryService {
  private cacheKey: string = 'categories';

  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const parentCategory = createCategoryDto.parentId
      ? await this.categoryRepository.findOne({
          where: { id: createCategoryDto.parentId },
        })
      : null;

    const category = new Category();
    category.parent = parentCategory ? parentCategory : null;
    Object.assign(category, createCategoryDto);
    await this.clearCache(category.id);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    // Get Categories from memory
    const categoriesCache = await this.cacheManager.get<Category[]>(this.cacheKey);

    if (categoriesCache) {
      console.log('return cache');
      return categoriesCache;
    }

    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: {
        children: {
          children: true,
        },
      },
    });

    await this.cacheManager.set(this.cacheKey, categories, CACHE_TTL);
    return categories;
  }

  async findOne(id: number) {
    const categoryCache = await this.cacheManager.get<Category>(`${this.cacheKey}:${id}`);

    if (categoryCache) {
      console.log('return cache');
      return categoryCache;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        children: true,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    await this.cacheManager.set(`${this.cacheKey}:${id}`, category, CACHE_TTL);

    return category;
  }

  async updateOne(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = (await this.findOne(id)) as Category;

    Object.assign(existingCategory, updateCategoryDto);

    await this.clearCache(id);

    return this.categoryRepository.save(existingCategory);
  }

  async deleteOne(id: number) {
    const existingCategory = (await this.findOne(id)) as Category;
    await this.clearCache(id);
    return this.categoryRepository.softRemove(existingCategory);
  }

  private async clearCache(id: number) {
    await Promise.all([
      this.cacheManager.del(`${this.cacheKey}:${id}`),
      this.cacheManager.del(this.cacheKey),
    ]);
  }
}
