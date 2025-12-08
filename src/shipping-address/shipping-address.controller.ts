import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import {
  createApiResponseArrayDto,
  createApiResponseDto,
  CurrentUser,
  ResponseMessage,
  TransformDTO,
} from 'src/common';
import {
  CreateShippingAddressDto,
  ResponseShippingAddressDto,
  UpdateShippingAddressDto,
} from './dto';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

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

  @Get('')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseShippingAddressDto),
  })
  findAll() {
    return this.shippingAddressService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingAddressDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingAddressService.findOne(id);
  }

  @Get('me')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingAddressDto),
  })
  findMyAddresses(@CurrentUser('id') userId: number) {
    return this.shippingAddressService.findMyAddresses(userId);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseShippingAddressDto),
  })
  updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingAddressDto: UpdateShippingAddressDto,
  ) {
    return this.shippingAddressService.update(id, updateShippingAddressDto);
  }

  @Delete(':id')
  @ResponseMessage('Address deleted successfully')
  removeAddress(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.shippingAddressService.removeAddress(userId, id);
  }
}
