import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ShippingRuleService } from './shipping-rule.service';
import { CreateShippingRuleDto, ResponseShippingRuleDto } from './dto';
import { createApiResponseDto, TransformDTO } from 'src/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('shipping-rule')
@TransformDTO(ResponseShippingRuleDto)
export class ShippingRuleController {
  constructor(private readonly shippingRuleService: ShippingRuleService) {}

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  create(@Body() createShippingRuleDto: CreateShippingRuleDto) {
    return this.shippingRuleService.create(createShippingRuleDto);
  }
}
