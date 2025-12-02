import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EndpointService {
  constructor(@InjectRepository(Endpoint) private endpointRepository: Repository<Endpoint>) {}

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
