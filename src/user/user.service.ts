import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.getRole(createUserDto.role);
    const user = this.userRepository.create({
      ...createUserDto,
      password: createUserDto.password,
      role,
    });
    return this.userRepository.save(user);
  }

  async findOne(filterQuery: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: filterQuery,
      relations: {
        role: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  findOneByEmail(email: string) {
    return this.findOne({ email });
  }

  findOneById(id: number) {
    return this.findOne({ id });
  }

  findAll() {
    return this.userRepository.find({
      where: { isActive: true },
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

    user.isActive = false;

    return this.userRepository.save(user);
  }
}
