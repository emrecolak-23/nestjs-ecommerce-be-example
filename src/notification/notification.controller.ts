import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { createApiResponseArrayDto, createApiResponseDto, TransformDTO } from 'src/common';
import { ResponseNotificationDto } from './dto/response-notification.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('notifications')
@TransformDTO(ResponseNotificationDto)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  @ApiOkResponse({
    type: createApiResponseArrayDto(ResponseNotificationDto),
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: createApiResponseDto(ResponseNotificationDto),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }
}
