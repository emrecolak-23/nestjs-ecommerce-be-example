import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';
import { Repository } from 'typeorm';
import { CreateShippingRuleDto, UpdateShippingRuleDto, UpdateShippingRuleStatusDto } from './dto';

@Injectable()
export class ShippingRuleService {
  constructor(
    @InjectRepository(ShippingRule) private shippingRuleRepository: Repository<ShippingRule>,
  ) {}

  create(createShippingRuleDto: CreateShippingRuleDto) {
    const shippingRule = new ShippingRule();
    Object.assign(shippingRule, createShippingRuleDto);
    return this.shippingRuleRepository.save(shippingRule);
  }

  findAll() {
    return this.shippingRuleRepository.find({
      where: {
        status: true,
      },
    });
  }

  async findOne(id: number) {
    const rule = await this.shippingRuleRepository.findOne({
      where: {
        id,
      },
    });

    if (!rule) throw new NotFoundException('Shipping rule not found');

    return rule;
  }

  async updateOne(id: number, updateShippingRuleDto: UpdateShippingRuleDto) {
    const { estimateDay, cost } = updateShippingRuleDto;
    const rule = await this.findOne(id);

    rule.estimateDay = estimateDay || updateShippingRuleDto.estimateDay;
    rule.cost = cost || updateShippingRuleDto.cost;

    return this.shippingRuleRepository.save(rule);
  }

  async updateStatus(id: number, updateShippingRuleStatusDto: UpdateShippingRuleStatusDto) {
    const rule = await this.findOne(id);

    rule.status = updateShippingRuleStatusDto.status;

    return this.shippingRuleRepository.save(rule);
  }

  async remove(id: number) {
    const rule = await this.findOne(id);

    return this.shippingRuleRepository.remove(rule);
  }
}
