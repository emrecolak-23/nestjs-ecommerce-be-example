import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { BcryptService } from 'src/auth/providers';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), CartModule],
  controllers: [UserController],
  providers: [UserService, RoleService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
