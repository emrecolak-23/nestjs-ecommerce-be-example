import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { BcryptService } from 'src/auth/providers';
import { CartModule } from 'src/cart/cart.module';
import { PasswordChangeRequest } from './entities/password-change-request.entity';
import { PasswordRecoveryService } from './password-recovery.service';
import { PaswordRecoveryController } from './password-recovery.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, PasswordChangeRequest]), CartModule],
  controllers: [UserController, PaswordRecoveryController],
  providers: [UserService, RoleService, BcryptService, PasswordRecoveryService],
  exports: [UserService],
})
export class UserModule {}
