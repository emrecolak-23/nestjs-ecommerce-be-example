import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VariantItemsService } from './variant-items.service';
import { CreateVariantItemDto, ResponseVariantItemDto } from './dto';
import { createApiResponseArrayDto, createApiResponseDto, TransformDTO } from 'src/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('variant-items')
@TransformDTO(ResponseVariantItemDto)
export class VariantItemsController {
  constructor(private readonly variantItemsService: VariantItemsService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseVariantItemDto),
  })
  create(@Body() createVariantItemDto: CreateVariantItemDto) {
    return this.variantItemsService.create(createVariantItemDto);
  }

  @Get('variants/:variantId')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseVariantItemDto),
  })
  findAll(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.variantItemsService.findAll(variantId);
  }

  @Get(':variantItemId')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseVariantItemDto),
  })
  findOne(@Param('variantItemId', ParseIntPipe) variantItemId: number) {
    return this.variantItemsService.findOne(variantItemId);
  }

  @Delete(':variantItemId')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseVariantItemDto),
  })
  deleteOne(@Param('variantItemId', ParseIntPipe) variantItemId: number) {
    return this.variantItemsService.remove(variantItemId);
  }
}
