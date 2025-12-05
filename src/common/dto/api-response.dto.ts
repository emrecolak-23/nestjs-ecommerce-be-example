import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'Success', required: false })
  message?: string;

  @ApiProperty()
  data: T;
}

export function createApiResponseDto<T>(dataType: new () => T) {
  class ApiResponseWrapper {
    @ApiProperty({ example: 'Success', required: false })
    message?: string;

    @ApiProperty({ type: dataType })
    data: T;
  }

  Object.defineProperty(ApiResponseWrapper, 'name', {
    value: `ApiResponseOf${dataType.name}`,
  });

  return ApiResponseWrapper;
}

export function createApiResponseArrayDto<T>(dataType: new () => T) {
  class ApiResponseArrayWrapper {
    @ApiProperty({ example: 'Success', required: false })
    message?: string;

    @ApiProperty({ type: [dataType] })
    data: T[];
  }

  Object.defineProperty(ApiResponseArrayWrapper, 'name', {
    value: `ApiResponseArrayOf${dataType.name}`,
  });

  return ApiResponseArrayWrapper;
}
