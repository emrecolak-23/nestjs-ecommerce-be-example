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
import { CategoryService } from './category.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, ResponseCategoryDto, UpdateCategoryDto } from './dto';
import {
  createApiResponseDto,
  createApiResponseArrayDto,
  ResponseMessage,
  TransformDTO,
} from 'src/common';

@ApiTags('Category')
@TransformDTO(ResponseCategoryDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @ResponseMessage('Category created successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseCategoryDto),
    description: 'Category created successfully',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/')
  @ResponseMessage('Get all category')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseCategoryDto),
    description: 'List of all categories',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseCategoryDto),
    description: 'Category found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch('/:id')
  @ResponseMessage('Category updated successfully')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseCategoryDto),
    description: 'Category updated successfully',
  })
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateOne(id, updateCategoryDto);
  }

  @Delete('/:id')
  @ResponseMessage('Category deleted successfully')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteOne(id);
  }
}
