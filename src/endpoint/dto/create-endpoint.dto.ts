import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { HttpMethod } from '../entities/endpoint.entity';
import { ApiProperty } from '@nestjs/swagger';

export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export class CreateEndpointDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(httpMethods)
  method: HttpMethod;
}
