import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CategoryService } from 'src/category/category.service';
import { FilterOperator, FilterSuffix, PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private cacheKey: string = 'products';

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    product.category = category;
    Object.assign(product, createProductDto);

    const storedProduct = await this.productRepository.save(product);

    await this.clearCache(storedProduct.id, storedProduct.slug);

    return storedProduct;
  }

  //   async findAll() {
  //     const products = await this.productRepository.find({});
  //     return products;
  //   }

  async save(product: Product) {
    return this.productRepository.save(product);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    this.logger.debug(`Get all products with ${JSON.stringify(query)}`);

    const cachedProducts = await this.cacheManager.get<Paginated<Product>>(
      `${this.cacheKey}:${JSON.stringify(query)}`,
    );

    if (cachedProducts) {
      this.logger.debug('return products from cache');
      return cachedProducts;
    }

    const products = await paginate(query, this.productRepository, {
      sortableColumns: ['id', 'name', 'price'],
      defaultSortBy: [['price', 'DESC']],
      searchableColumns: ['name', 'longDescription', 'shortDescription'],
      filterableColumns: {
        name: [FilterOperator.ILIKE, FilterSuffix.NOT],
        shortDescription: [FilterOperator.ILIKE, FilterSuffix.NOT],
        longDescription: [FilterOperator.ILIKE, FilterSuffix.NOT],
      },
    });

    await this.cacheManager.set(`${this.cacheKey}:${JSON.stringify(query)}`, products);

    return products;
  }

  async findOne(filterQuery: FindOptionsWhere<Product>) {
    const productCached = await this.cacheManager.get<Product>(
      `${this.cacheKey}:${filterQuery.id || filterQuery.slug}`,
    );

    if (productCached) {
      console.log('return from cached');
      return productCached;
    }

    const product = await this.productRepository.findOne({
      where: filterQuery,
      relations: {
        variants: {
          items: true,
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.cacheManager.set(`${this.cacheKey}:${filterQuery.id || filterQuery.slug}`, product);

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

    await this.clearCache(product.id, product.slug);

    return this.productRepository.save(product);
  }

  async deleteOne(id: number) {
    const product = await this.findOneById(id);

    await this.clearCache(product.id, product.slug);

    return this.productRepository.softRemove(product);
  }

  async clearCache(id: number, slug: string) {
    await Promise.all([
      this.cacheManager.del(this.cacheKey),
      this.cacheManager.del(`${this.cacheKey}:${id}`),
      this.cacheManager.del(`${this.cacheKey}:${slug}`),
    ]);
  }
}
