import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { HttpMethod } from '../entities/endpoint.entity';

export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export class CreateEndpointDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsIn(httpMethods)
  method: HttpMethod;
}
