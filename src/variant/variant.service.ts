import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private readonly productService: ProductService,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const product = await this.productService.findOneById(createVariantDto.productId);

    const variant = new Variant();

    Object.assign(variant, { ...createVariantDto, name: createVariantDto.name.toLowerCase() });
    variant.product = product;

    return this.variantRepository.save(variant);
  }

  async findAll(productId: number) {
    const product = await this.productService.findOneById(productId);
    return this.variantRepository.find({
      where: { product },
      relations: {
        product: true,
      },
    });
  }

  async findOne(variantId: number) {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
      relations: {
        product: true,
      },
    });

    if (!variant) throw new NotFoundException();

    return variant;
  }

  async remove(variantId: number) {
    const variant = await this.findOne(variantId);

    return this.variantRepository.remove(variant);
  }
}
