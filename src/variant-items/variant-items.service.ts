import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantItems } from './entities/variant-items.entity';
import { Repository } from 'typeorm';
import { CreateVariantItemDto } from './dto';
import { VariantService } from 'src/variant/variant.service';

@Injectable()
export class VariantItemsService {
  constructor(
    @InjectRepository(VariantItems) private variantItemsRepository: Repository<VariantItems>,
    private readonly variantService: VariantService,
  ) {}

  async create(createVariantItemDto: CreateVariantItemDto) {
    const variant = await this.variantService.findOne(createVariantItemDto.variantId);

    const variantItem = new VariantItems();

    Object.assign(variantItem, createVariantItemDto);
    variantItem.variant = variant;

    return this.variantItemsRepository.save(variantItem);
  }

  async findAll(variantId: number) {
    const variant = await this.variantService.findOne(variantId);

    const variantItems = await this.variantItemsRepository.find({
      where: {
        variant,
      },
      relations: {
        variant: true,
      },
    });

    return variantItems;
  }

  async findOne(variantItemId: number) {
    const variantItem = await this.variantItemsRepository.findOne({
      where: { id: variantItemId },
      relations: {
        variant: true,
      },
    });

    if (!variantItem) throw new NotFoundException('Variant item not found');

    return variantItem;
  }

  async remove(variantItemId: number) {
    const variantItem = await this.findOne(variantItemId);

    return this.variantItemsRepository.remove(variantItem);
  }
}
