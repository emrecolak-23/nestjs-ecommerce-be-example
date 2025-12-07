import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { createApiResponseDto, CurrentUser, ResponseMessage, TransformDTO } from 'src/common';
import { CreateShippingAddressDto, ResponseShippingAddressDto } from './dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('shipping-address')
@TransformDTO(ResponseShippingAddressDto)
export class ShippingAddressController {
  constructor(private readonly shippingAddressService: ShippingAddressService) {}

  @Post('')
  @ResponseMessage('Shipping address created successfully')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseShippingAddressDto),
  })
  create(
    @CurrentUser('id') userId: number,
    @Body() createShippingAddressDto: CreateShippingAddressDto,
  ) {
    return this.shippingAddressService.create(userId, createShippingAddressDto);
  }
}
