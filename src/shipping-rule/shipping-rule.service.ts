import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';
import { Repository } from 'typeorm';
import { CreateShippingRuleDto } from './dto';

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
}
