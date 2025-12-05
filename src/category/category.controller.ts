import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, ResponseCategoryDto } from './dto';
import { ResponseMessage, TransformDTO } from 'src/common';

@ApiTags('Category')
@TransformDTO(ResponseCategoryDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @ResponseMessage('Category created successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseCategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/')
  @ResponseMessage('Get all category')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ResponseCategoryDto],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseCategoryDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }
}
