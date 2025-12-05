import { BadRequestException, Injectable, PipeTransform, Logger } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import * as CONSTANTS from '../constants';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private logger = new Logger(FileTypeValidationPipe.name);

  async transform(value: Express.Multer.File) {
    this.logger.log('File type validation starting');

    const file = await fileTypeFromBuffer(value.buffer);
    if (!file) {
      throw new BadRequestException('The file is not valid.');
    }

    if (!CONSTANTS.MIME_TYPES.includes(file.mime)) {
      throw new BadRequestException('The file should be either png, jpeg, jpg.');
    }

    if (value.size > CONSTANTS.FILE_SIZE_LIMIT) {
      throw new BadRequestException('The image size should be less than 5MB.');
    }

    this.logger.log('File type validation passed');

    return value;
  }
}
