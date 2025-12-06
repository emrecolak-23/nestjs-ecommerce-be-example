import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { CreateProductGalleryDto } from './dto';
import { ResponseMessage } from 'src/common';

@Controller('product-galleries')
export class ProductGalleriesController {
  constructor(private readonly productGalleriesService: ProductGalleriesService) {}

  @Delete('/:id')
  @ResponseMessage('Gallery deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productGalleriesService.remove(id);
  }
}
