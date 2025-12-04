import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto } from './dto';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Endpoints')
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
