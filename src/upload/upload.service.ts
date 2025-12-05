import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { UploadType } from './enums';

@Injectable()
export class UploadService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly productsService: ProductService,
    private readonly usersService: UserService,
  ) {}

  async uploadFile(file: Express.Multer.File, type: UploadType, entityId: number) {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    const uniqueSuffix = uuidv4();
    const fileKey = `${type}/${entityId}/${fileName}-${uniqueSuffix}${fileExtension}`;

    await this.s3Service.uploadFile(fileKey, file.buffer, file.mimetype, 'inline');

    if (type === UploadType.PRODUCTS) {
      const product = await this.productsService.findOneById(entityId);
      product.image = fileKey;
      await this.productsService.save(product);
    }

    return;
  }
}
