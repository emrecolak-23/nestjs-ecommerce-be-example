import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    // const product = await this.productService.findOneById(createReviewDto.productId);
    // const user = await this.userService.findOneById(userId);

    const [product, user] = await Promise.all([
      this.productService.findOneById(createReviewDto.productId),
      this.userService.findOneById(userId),
    ]);

    const review = new Review();
    review.content = createReviewDto.content;
    review.rating = createReviewDto.rating;
    review.user = user;
    review.product = product;

    return this.reviewRepository.save(review);
  }
}
