import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function TransformDTO<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new TransformDtoInterceptor(dto));
}

@Injectable()
export class TransformDtoInterceptor<T> implements NestInterceptor {
  constructor(private readonly dtoClass: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.data) {
          return {
            // Paginated
            data: plainToInstance(this.dtoClass, data.data, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            }),
            meta: {
              ...data.meta,
            },
          };
        }

        return plainToInstance(this.dtoClass, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
