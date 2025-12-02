import { Module } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { EndpointController } from './endpoint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint])],
  controllers: [EndpointController],
  providers: [EndpointService],
})
export class EndpointModule {}
