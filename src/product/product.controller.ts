import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { createApiResponseDto, TransformDTO } from 'src/common';
import { CreateProductDto, ResponseProductDto } from './dto';
import { ApiResponse } from '@nestjs/swagger';

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
}
