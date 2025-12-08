import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Repository } from 'typeorm';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from './dto';
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

  async findAll() {
    return this.shippingAddressRepository.find({
      relations: { user: true },
    });
  }

  async findMyAddresses(userId: number) {
    return this.shippingAddressRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const address = await this.shippingAddressRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!address) throw new NotFoundException('Address not found');

    return address;
  }

  async update(id: number, updateShippingAddressDto: UpdateShippingAddressDto) {
    const { phoneNumber, value } = updateShippingAddressDto;
    const address = await this.findOne(id);
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.value = value || address.value;
    return this.shippingAddressRepository.save(address);
  }

  async removeAddress(userId: number, addressId: number) {
    const address = await this.findOne(addressId);

    if (address.user.id !== userId)
      throw new UnauthorizedException('You can not remove this address');

    return this.shippingAddressRepository.remove(address);
  }
}
