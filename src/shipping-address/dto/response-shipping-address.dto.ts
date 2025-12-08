import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/user/dto';
import { ShippingAddress } from '../entities/shipping-address.entity';

export class ResponseShippingAddressDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  // @ApiProperty()
  // @Expose()
  // @Type(() => ResponseUserDto)
  // user: ResponseUserDto;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: ShippingAddress }) => obj?.user?.id)
  userId: number;
}
