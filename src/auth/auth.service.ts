import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './providers/bcrypt.service';
import { UserPayload } from './types';
import { SignInDto } from './dto/sign-in.dto';
import { TokenService } from './providers';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, email, ...userData } = signUpDto;
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    const hashedPassword = await this.bcryptService.hash(password);
    const user = await this.userService.create({
      ...userData,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const accessToken = await this.tokenService.generateToken(user.id, email);

    return { accessToken, user };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const existingUser = await this.userService.findOneByEmail(email!);

    if (!existingUser) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.compare(password!, existingUser.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const accessToken = await this.tokenService.generateToken(existingUser.id, existingUser.email);
    const user = plainToInstance(User, existingUser);

    return { accessToken, user };
  }
}
