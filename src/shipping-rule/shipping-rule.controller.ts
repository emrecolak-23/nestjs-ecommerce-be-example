import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShippingRuleService } from './shipping-rule.service';
import { CreateShippingRuleDto, ResponseShippingRuleDto } from './dto';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  ResponseMessage,
  TransformDTO,
} from 'src/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('shipping-rule')
@TransformDTO(ResponseShippingRuleDto)
export class ShippingRuleController {
  constructor(private readonly shippingRuleService: ShippingRuleService) {}

  @Post('')
  @ResponseMessage('Shipping rule created successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  create(@Body() createShippingRuleDto: CreateShippingRuleDto) {
    return this.shippingRuleService.create(createShippingRuleDto);
  }

  @Get('')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseShippingRuleDto),
  })
  findAll() {
    return this.shippingRuleService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseShippingRuleDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingRuleService.findOne(id);
  }
}
