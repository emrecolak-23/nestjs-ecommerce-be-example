import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dto';
import { RoleService } from 'src/role/role.service';
import { BcryptService } from 'src/auth/providers';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly bcryptService: BcryptService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.getRole(createUserDto.role);
    const user = this.userRepository.create({
      ...createUserDto,
      password: createUserDto.password,
      role,
    });
    const savedUser = await this.userRepository.save(user);
    await this.cartService.create(savedUser);
    return savedUser;
  }

  async findOne(filterQuery: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: filterQuery,
      relations: {
        role: true,
        orders: {
          orderDetails: {
            product: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });
  }

  findOneById(id: number) {
    return this.findOne({ id });
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        role: true,
      },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    user.firstname = updateUserDto.firstname || user.firstname;
    user.lastname = updateUserDto.lastname || user.lastname;

    return this.userRepository.save(user);
  }

  async deleteOne(id: number) {
    const user = await this.findOneById(id);

    return this.userRepository.softRemove(user);
  }

  async changeMyPassword(id: number, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword)
      throw new UnauthorizedException('Confirmed password invalid');

    const user = await this.findOneById(id);

    const isCurrentPasswordValid = await this.bcryptService.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) throw new UnauthorizedException('Current password mismatch');

    const newHashedPassword = await this.bcryptService.hash(changePasswordDto.newPassword);
    user.password = newHashedPassword;

    return this.userRepository.save(user);
  }
}
