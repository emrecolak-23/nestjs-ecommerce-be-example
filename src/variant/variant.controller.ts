import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto, ResponseVariantDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponseDto, TransformDTO } from 'src/common';

@ApiTags('Variants')
@Controller('variants')
@TransformDTO(ResponseVariantDto)
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: createApiResponseDto(ResponseVariantDto),
  })
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }
}
