import { Controller } from '@nestjs/common';
import { ShippingRuleService } from './shipping-rule.service';

@Controller('shipping-rule')
export class ShippingRuleController {
  constructor(private readonly shippingRuleService: ShippingRuleService) {}
}
