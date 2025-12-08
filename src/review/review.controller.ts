import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, ResponseReviewDto } from './dto';
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
}
