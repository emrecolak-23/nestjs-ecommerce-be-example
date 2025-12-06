import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { S3Service } from 'src/common';
import { ValidateFileTypeMiddleware } from './middlewares';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { ProductGalleriesModule } from 'src/product-galleries/product-galleries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product]),
    ProductModule,
    UserModule,
    ProductGalleriesModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, S3Service],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateFileTypeMiddleware)
      .forRoutes({ path: 'uploads/file/:type/:entityId', method: RequestMethod.POST });
  }
}
