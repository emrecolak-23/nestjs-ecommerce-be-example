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
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType } from './enums/upload-type.enum';
import { FileTypeValidationPipe } from './pipes';
import { ResponseMessage } from 'src/common';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':type/:entityId')
  @ResponseMessage('Upload file successfully')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
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
    this.uploadService.uploadFile(file, type, entityId);

    return;
  }
}
