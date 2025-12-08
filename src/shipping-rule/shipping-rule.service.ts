import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingRuleService {
  constructor(
    @InjectRepository(ShippingRule) private shippingRuleRepository: Repository<ShippingRule>,
  ) {}
}
