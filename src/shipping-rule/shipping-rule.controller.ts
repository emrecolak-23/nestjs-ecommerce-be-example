import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ShippingRuleService } from './shipping-rule.service';
import {
  CreateShippingRuleDto,
  ResponseShippingRuleDto,
  UpdateShippingRuleDto,
  UpdateShippingRuleStatusDto,
} from './dto';
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
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingRuleService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update shipping rule successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingRuleDto: UpdateShippingRuleDto,
  ) {
    return this.shippingRuleService.updateOne(id, updateShippingRuleDto);
  }

  @Patch(':id/status')
  @ResponseMessage('Update shipping rule status successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingRuleStatusDto: UpdateShippingRuleStatusDto,
  ) {
    return this.shippingRuleService.updateStatus(id, updateShippingRuleStatusDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete shipping rule  successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingRuleDto),
  })
  deleteOne(@Param('id') id: number) {
    return this.shippingRuleService.remove(id);
  }
}
