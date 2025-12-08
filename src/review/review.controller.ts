import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, ResponseReviewDto } from './dto';
import { createApiResponseDto, CurrentUser, ResponseMessage, TransformDTO } from 'src/common';
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
}
