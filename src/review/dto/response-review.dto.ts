import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Review } from '../entities/review.entity';

export class ResponseReviewDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  rating: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: Review }) => obj?.product?.name)
  product: string;
}
