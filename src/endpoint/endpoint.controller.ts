import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto } from './dto';
import { HttpAdapterHost } from '@nestjs/core';
import { httpMethods } from './dto';

@Controller('endpoint')
export class EndpointController {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @Get('all')
  getAll() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const instance = httpAdapter.getInstance();

    const router = instance.router;

    if (router?.stack) {
      const routes = router.stack
        .filter((layer) => layer.route)
        .filter((layer) => httpMethods.includes(Object.keys(layer.route.methods)[0].toUpperCase()))
        .map((layer) => ({
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
          path: layer.route.path,
        }));

      return routes;
    }

    return { error: 'Router not found' };
  }

  @Post()
  async createEndpoint(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointService.createEndpoint(createEndpointDto);
  }
}
