import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadType } from './enums/upload-type.enum';
import { FileTypeValidationPipe } from './pipes';
import { ResponseMessage } from 'src/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesUploadDto, FileUploadDto } from './dto';
import { MAX_UPLOAD_MULTIPLE_FILE_COUNT } from './constants';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product-gallery/:productId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload type of contents',
    type: FilesUploadDto,
  })
  @ResponseMessage('Upload files successfully')
  @UseInterceptors(FilesInterceptor('files', MAX_UPLOAD_MULTIPLE_FILE_COUNT))
  async uploadManyFiles(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(productId, 'productId');
    await this.uploadService.uploadManyFiles(files, productId);
    return;
  }

  @Post('file/:type/:entityId')
  @ResponseMessage('Upload file successfully')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload type of content',
    type: FileUploadDto,
  })
  async uploadImage(
    @Param('type') type: UploadType,
    @Param('entityId', ParseIntPipe) entityId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.uploadService.uploadFile(file, type, entityId);

    return;
  }
}
