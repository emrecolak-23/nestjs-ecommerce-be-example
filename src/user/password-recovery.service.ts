import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordChangeRequest } from './entities/password-change-request.entity';
import { Repository } from 'typeorm';
import { ForgotPasswordDto, ResetPasswordDto } from './dto';
import { UserService } from './user.service';
import { v4 as uuidV4 } from 'uuid';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordChangedEvent } from 'src/events';
import { BcryptService } from 'src/auth/providers';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectRepository(PasswordChangeRequest)
    private passwordChangeRequestRepository: Repository<PasswordChangeRequest>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly bcryptService: BcryptService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = (await this.userService.findOneByEmail(forgotPasswordDto.email)) as User;

    const changedPasswordUser = await this.passwordChangeRequestRepository.findOne({
      where: {
        user: user,
      },
    });

    if (changedPasswordUser) {
      throw new BadRequestException(
        'You already sent the forgot password before. Please try to reset password',
      );
    }

    const rawId = uuidV4();
    const hashedUUID = crypto.createHash('sha256').update(rawId).digest('hex');
    const passwordChangeRequest = new PasswordChangeRequest();
    passwordChangeRequest.id = hashedUUID;
    passwordChangeRequest.user = user;

    const entity = await this.passwordChangeRequestRepository.save(passwordChangeRequest);
    // expires in 10m

    const passwordChangedUrl = `http://localhost:3000?password-reset-id=${rawId}`;
    this.eventEmitter.emit(
      'password.changed',
      new PasswordChangedEvent(user.id, user.email, user.firstname, passwordChangedUrl),
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedUUID = crypto.createHash('sha256').update(resetPasswordDto.id).digest('hex');

    const userChangeRequest = await this.passwordChangeRequestRepository.findOne({
      where: {
        id: hashedUUID,
      },
      relations: {
        user: true,
      },
    });

    if (!userChangeRequest)
      throw new BadRequestException(
        'Error when reset password. Please try by forgot password again',
      );

    if (new Date().getTime() - new Date(userChangeRequest.currentTime).getTime() > 60 * 60 * 1000) {
      await this.passwordChangeRequestRepository.remove(userChangeRequest);
      throw new BadRequestException('Already expires, please forgot again');
    }

    const user = userChangeRequest.user;

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword)
      throw new BadRequestException('Password are not the same');

    user.password = await this.bcryptService.hash(resetPasswordDto.newPassword);
    await this.userService.save(user);

    await this.passwordChangeRequestRepository.remove(userChangeRequest);
  }
}
