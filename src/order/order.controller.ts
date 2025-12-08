import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentUser, TransformDTO } from 'src/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcessOrderDto, ResponseOrderDto } from './dto';

@ApiTags('orders')
@Controller('orders')
@TransformDTO(ResponseOrderDto)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  process(@CurrentUser('id') userId: number, @Body() processOrderDto: ProcessOrderDto) {
    return this.orderService.process(userId, processOrderDto);
  }
}
