import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    product.category = category;
    Object.assign(product, createProductDto);

    return this.productRepository.save(product);
  }

  async findAll() {
    const products = await this.productRepository.find({});
    return products;
  }

  async findOne(filterQuery: FindOptionsWhere<Product>) {
    const product = await this.productRepository.findOne({
      where: filterQuery,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async findOneById(id: number) {
    return this.findOne({ id });
  }

  async findOneBySlug(slug: string) {
    return this.findOne({ slug });
  }

  async updateOne(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneById(id);

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(updateProductDto.categoryId);
      product.category = category;
    }

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }
}
