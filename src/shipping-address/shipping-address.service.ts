import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Repository } from 'typeorm';
import { CreateShippingAddressDto } from './dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectRepository(ShippingAddress)
    private shippingAddressRepository: Repository<ShippingAddress>,
    private userService: UserService,
  ) {}

  async create(userId: number, createShippingAddressDto: CreateShippingAddressDto) {
    const user = await this.userService.findOneById(userId);
    const shippingAddress = new ShippingAddress();
    Object.assign(shippingAddress, createShippingAddressDto);
    shippingAddress.user = user;
    return this.shippingAddressRepository.save(shippingAddress);
  }
}
