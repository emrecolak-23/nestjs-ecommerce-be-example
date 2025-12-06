import { Injectable } from '@nestjs/common';
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
}
