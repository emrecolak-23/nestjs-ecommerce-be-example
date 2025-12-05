import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidateFileTypeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const allowedFileTypes = ['products', 'users'];
    const { type } = req.params;

    if (!allowedFileTypes.includes(type)) {
      throw new BadRequestException(`Type ${type} is not in ${allowedFileTypes.join(',')}`);
    }

    next();
  }
}
