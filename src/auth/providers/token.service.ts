import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(userId: number, email: string, roleName: string) {
    const payload: UserPayload = { id: userId, email, roleName };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<UserPayload>(token);
  }
}
