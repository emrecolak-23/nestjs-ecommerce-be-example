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
import { ReviewService } from './review.service';
import { CreateReviewDto, ResponseReviewDto, UpdateReviewDto } from './dto';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  CurrentUser,
  ResponseMessage,
  TransformDTO,
} from 'src/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('reviews')
@TransformDTO(ResponseReviewDto)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseReviewDto),
  })
  @ResponseMessage('Create review successfully')
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser('id') userId: number) {
    return this.reviewService.create(userId, createReviewDto);
  }

  @Get('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseArrayDto(ResponseReviewDto),
  })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':productId/me')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseArrayDto(ResponseReviewDto),
  })
  findMyAll(@CurrentUser('id') id: number, @Param('productId') productId: number) {
    return this.reviewService.findMyAll(id, productId);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseReviewDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseReviewDto),
  })
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.reviewService.updateOne(id, updateReviewDto, userId);
  }

  @Delete(':id')
  @ResponseMessage('Review deleted successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseReviewDto),
  })
  deleteOne(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.reviewService.removeOne(id, userId);
  }
}
