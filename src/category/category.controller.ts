import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, ResponseCategoryDto } from './dto';
import { TransformDTO } from 'src/common';

@ApiTags('Category')
@TransformDTO(ResponseCategoryDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseCategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
