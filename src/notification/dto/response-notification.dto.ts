import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseNotificationDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  isRead: boolean;
}
