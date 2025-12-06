import { Module } from '@nestjs/common';
import { VariantItemsService } from './variant-items.service';
import { VariantItemsController } from './variant-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantItems } from './entities/variant-items.entity';
import { VariantModule } from 'src/variant/variant.module';

@Module({
  imports: [TypeOrmModule.forFeature([VariantItems]), VariantModule],
  controllers: [VariantItemsController],
  providers: [VariantItemsService],
})
export class VariantItemsModule {}
