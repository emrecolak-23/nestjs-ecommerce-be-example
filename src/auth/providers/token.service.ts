import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserPayload } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(userId: number, email: string, roleName: string) {
    const payload: UserPayload = { id: userId, email, roleName };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(userId: number, email: string, roleName: string) {
    const payload: UserPayload = { id: userId, email, roleName };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
    });
  }

  async verifyToken(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verifyAsync<UserPayload>(token, options);
  }
}
