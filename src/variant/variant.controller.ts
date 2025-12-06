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
import { VariantService } from './variant.service';
import { CreateVariantDto, ResponseVariantDto } from './dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  ResponseMessage,
  TransformDTO,
} from 'src/common';

@ApiTags('Variants')
@Controller('variants')
@TransformDTO(ResponseVariantDto)
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post('/')
  @ResponseMessage('Variant create successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseVariantDto),
  })
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @Get('/products/:productId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: createApiResponseArrayDto(ResponseVariantDto),
  })
  findAll(@Param('productId', ParseIntPipe) productId: number) {
    return this.variantService.findAll(productId);
  }

  @Get('/:variantId')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseVariantDto),
  })
  findOne(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.variantService.findOne(variantId);
  }

  @Delete('/:variantId')
  @ResponseMessage('Variant deleted successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseVariantDto),
  })
  deleteOne(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.variantService.remove(variantId);
  }
}
