import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  CurrentUser,
  ResponseMessage,
  TransformDTO,
} from 'src/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UpdateOrderStatusDto,
  ProcessOrderDto,
  ResponseOrderDto,
  ResponseOrderDetailDto,
} from './dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Order created successfully')
  @TransformDTO(ResponseOrderDto)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseOrderDto),
  })
  process(@CurrentUser('id') userId: number, @Body() processOrderDto: ProcessOrderDto) {
    return this.orderService.process(userId, processOrderDto);
  }

  @Patch(':id')
  @ResponseMessage('Order status changed successfully')
  @TransformDTO(ResponseOrderDto)
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

  @Get('')
  @TransformDTO(ResponseOrderDto)
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseOrderDto),
  })
  findAll() {
    return this.orderService.findAll();
  }

  @Get('me')
  @TransformDTO(ResponseOrderDto)
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseOrderDto),
  })
  findMyAll(@CurrentUser('id') id: number) {
    return this.orderService.findMyOrders(id);
  }

  @Get(':id/details')
  @TransformDTO(ResponseOrderDetailDto)
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseOrderDetailDto),
  })
  findAllOrderDetail(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOrderDetail(id);
  }
}
