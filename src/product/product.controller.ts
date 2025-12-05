import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  ResponseMessage,
  TransformDTO,
} from 'src/common';
import { CreateProductDto, ResponseProductDto, UpdateProductDto } from './dto';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@TransformDTO(ResponseProductDto)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseProductDto),
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('/')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseProductDto),
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get('slug/:slug')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseProductDto),
  })
  findOneBySlug(@Param('slug') slug: string) {
    return this.productService.findOneBySlug(slug);
  }

  @Get('/:id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseProductDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  @Patch('/:id')
  @ResponseMessage('Product updated successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseProductDto),
  })
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateOne(id, updateProductDto);
  }
}
