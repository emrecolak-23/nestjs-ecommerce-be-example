import { Body, Controller, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { createApiResponseDto, CurrentUser, ResponseMessage, TransformDTO } from 'src/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateOrderStatusDto, ProcessOrderDto, ResponseOrderDto } from './dto';

@ApiTags('orders')
@Controller('orders')
@TransformDTO(ResponseOrderDto)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Order created successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseOrderDto),
  })
  process(@CurrentUser('id') userId: number, @Body() processOrderDto: ProcessOrderDto) {
    return this.orderService.process(userId, processOrderDto);
  }

  @Patch(':id')
  @ResponseMessage('Order status changed successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseOrderDto),
  })
  updateOrderStatus(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(userId, id, updateOrderStatusDto);
  }
}
