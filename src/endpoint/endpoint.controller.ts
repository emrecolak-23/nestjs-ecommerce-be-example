import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto } from './dto';
import { HttpAdapterHost } from '@nestjs/core';
import { httpMethods } from './dto';
import { Public } from 'src/common';

@Controller('endpoint')
export class EndpointController {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @Get('all')
  getAllRoutes() {
    return this.endpointService.getAllRoutes();
  }

  @Post()
  async createEndpoint(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointService.createEndpoint(createEndpointDto);
  }
}
