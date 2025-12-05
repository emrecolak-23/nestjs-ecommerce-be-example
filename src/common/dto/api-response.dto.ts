import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'Success', required: false })
  message?: string;

  @ApiProperty()
  data: T;
}

export function createApiResponseDto<T>(dataType: new () => T) {
  class ApiResponse {
    @ApiProperty({ example: 'Success', required: false })
    message?: string;

    @ApiProperty({ type: dataType })
    data: T;
  }
  return ApiResponse;
}

export function createApiResponseArrayDto<T>(dataType: new () => T) {
  class ApiResponse {
    @ApiProperty({ example: 'Success', required: false })
    message?: string;

    @ApiProperty({ type: [dataType] })
    data: T[];
  }
  return ApiResponse;
}
