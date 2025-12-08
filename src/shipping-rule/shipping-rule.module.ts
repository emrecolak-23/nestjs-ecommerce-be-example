import { Module } from '@nestjs/common';
import { ShippingRuleService } from './shipping-rule.service';
import { ShippingRuleController } from './shipping-rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingRule])],
  controllers: [ShippingRuleController],
  providers: [ShippingRuleService],
  exports: [ShippingRuleService],
})
export class ShippingRuleModule {}
