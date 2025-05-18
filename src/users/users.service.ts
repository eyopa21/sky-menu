import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  findAll(query: QueryUserDto) {
    const where: FindOptionsWhere<Users> = {};

    const filterOptions = query.filters;
    const sortOptions = query.sort;

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    if (filterOptions) {
      if (filterOptions.full_name) {
        where.full_name = ILike(`%${filterOptions.full_name}%`);
      }
      if (filterOptions.email) {
        where.email = filterOptions.email;
      }
      if (filterOptions.phone_number) {
        where.phone_number = ILike(`%${filterOptions.phone_number}%`);
      }
    }

    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
      relations: ['projects'],
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return user;
  }
  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    let hashedPassword: string = '';
    const salt = await bcrypt.genSalt();
    hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const userObject = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (userObject) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.userRepository.save(user);
  }
}
