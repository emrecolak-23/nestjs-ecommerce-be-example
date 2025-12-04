import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { Repository } from 'typeorm';
import { HttpAdapterHost } from '@nestjs/core';
import { httpMethods } from './dto';

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(Endpoint) private endpointRepository: Repository<Endpoint>,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  getAllRoutes() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const instance = httpAdapter.getInstance();

    const router = instance.router;

    if (router?.stack) {
      const routes = router.stack
        .filter((layer) => {
          return layer.route && !layer.route.path.includes('api-docs');
        })
        .filter((layer) => httpMethods.includes(Object.keys(layer.route.methods)[0].toUpperCase()))
        .map((layer) => ({
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
          path: layer.route.path,
        }));

      return routes;
    }

    return { error: 'Router not found' };
  }

  async createEndpoint(createEndpointDto: CreateEndpointDto) {
    const { method, url } = createEndpointDto;

    const existingEndpoint = await this.endpointRepository.findOne({
      where: {
        url,
        method,
      },
    });

    if (existingEndpoint)
      throw new BadRequestException(`Endpoint ${method}-${url} has already exist`);

    const endpoint = this.endpointRepository.create({
      url,
      method,
    });

    return this.endpointRepository.save(endpoint);
  }
}
