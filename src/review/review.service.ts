import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto, UpdateReviewDto } from './dto';
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

    const allOrdersDetail = user.orders
      .filter((order) => order.orderStatus === 'success')
      .map((order) => order.orderDetails)
      .flat();

    if (allOrdersDetail.length === 0)
      throw new UnauthorizedException('You must buy this product to make review');

    const productOrderDetail = allOrdersDetail.find(
      (orderDetail) => orderDetail.product?.id === createReviewDto.productId,
    );

    if (!productOrderDetail)
      throw new UnauthorizedException('You must buy this product to make review');

    const review = new Review();
    review.content = createReviewDto.content;
    review.rating = createReviewDto.rating;
    review.user = user;
    review.product = product;

    return this.reviewRepository.save(review);
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({
      relations: {
        product: true,
        user: true,
      },
    });
    return reviews;
  }

  async findMyAll(userId: number, productId: number) {
    const reviews = await this.reviewRepository.find({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
    });
    return reviews;
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        product: true,
      },
    });

    if (!review) throw new NotFoundException('Review not found');

    return review;
  }

  async updateOne(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const { content, rating } = updateReviewDto;
    const review = await this.findOne(id);

    if (review.user.id !== userId) throw new UnauthorizedException('You can not edit this review');

    review.content = content || review.content;
    review.rating = rating || review.rating;

    return this.reviewRepository.save(review);
  }

  async removeOne(id: number, userId: number) {
    const review = await this.findOne(id);

    if (review.user.id !== userId) throw new UnauthorizedException('You can not edit this review');

    return this.reviewRepository.remove(review);
  }
}
