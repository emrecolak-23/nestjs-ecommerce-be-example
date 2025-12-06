import { Module } from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { ProductGalleriesController } from './product-galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGallery } from './entities/product-gallery.entity';
import { S3Service } from 'src/common';

@Module({
  imports: [TypeOrmModule.forFeature([ProductGallery])],
  controllers: [ProductGalleriesController],
  providers: [ProductGalleriesService, S3Service],
  exports: [ProductGalleriesService],
})
export class ProductGalleriesModule {}
