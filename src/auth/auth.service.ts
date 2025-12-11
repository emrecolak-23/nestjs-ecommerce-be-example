import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { BcryptService } from './providers/bcrypt.service';
import { SignInDto } from './dto/sign-in.dto';
import { TokenService } from './providers';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/events';
import { RoleService } from 'src/role/role.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, email, ...userData } = signUpDto;
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    const hashedPassword = await this.bcryptService.hash(password);
    const userRole = await this.roleService.getRole('user');
    const user = await this.userService.create({
      ...userData,
      email,
      password: hashedPassword,
      role: userRole.name,
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user.id, user.email, user.firstname),
    );

    // const accessToken = await this.tokenService.generateToken(user.id, email, user.role.name);
    // const refreshToken = await this.tokenService.generateRefreshToken(
    //   user.id,
    //   email,
    //   user.role.name,
    // );

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateToken(user.id, email, user.role.name),
      this.tokenService.generateRefreshToken(user.id, email, user.role.name),
    ]);

    return { accessToken, refreshToken, user };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const existingUser = await this.userService.findOneByEmail(email!);

    if (!existingUser) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.compare(password!, existingUser.password);
    if (!isPasswordValid) {
      this.logger.error('The user input wrong information');
      throw new ForbiddenException('Invalid credentials');
    }

    // const accessToken = await this.tokenService.generateToken(
    //   existingUser.id,
    //   existingUser.email,
    //   existingUser.role.name,
    // );

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateToken(existingUser.id, existingUser.email, existingUser.role.name),
      this.tokenService.generateRefreshToken(
        existingUser.id,
        existingUser.email,
        existingUser.role.name,
      ),
    ]);

    const user = plainToInstance(User, existingUser);

    return { accessToken, refreshToken, user };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.tokenService.verifyToken(refreshToken, {
        secret: this.configService.get('REFRESH_SECRET'),
      });
      console.log(payload, 'payload');
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.tokenService.generateToken(payload.id, payload.email, payload.roleName),
        this.tokenService.generateRefreshToken(payload.id, payload.email, payload.roleName),
      ]);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new BadRequestException('Refresh token already expired');
    }
  }
}
