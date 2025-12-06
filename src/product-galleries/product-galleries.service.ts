import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGallery } from './entities/product-gallery.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { S3Service } from 'src/common';

@Injectable()
export class ProductGalleriesService {
  constructor(
    @InjectRepository(ProductGallery) private productGalleryRepository: Repository<ProductGallery>,
    private readonly s3Service: S3Service,
  ) {}

  create(image: string, product: Product) {
    const gallery = new ProductGallery();
    gallery.image = image;
    gallery.product = product;
    return this.productGalleryRepository.save(gallery);
  }

  async findOne(id: number) {
    const gallery = await this.productGalleryRepository.findOne({
      where: { id },
    });

    if (!gallery) throw new NotFoundException('Gallery not found');

    return gallery;
  }

  async remove(id: number) {
    const gallery = await this.findOne(id);
    const fileKey = gallery.image;
    await this.s3Service.deleteFile(fileKey);

    return this.productGalleryRepository.remove(gallery);
  }
}
