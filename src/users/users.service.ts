import { ClassSerializerInterceptor, HttpException, HttpStatus, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Projects } from 'src/projects/entity/projects.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Projects)
        private readonly projectsRepository: Repository<Projects>
    ) { }
    findAll() {
        return this.userRepository.find({
            relations: ['projects']
        })
    }
    async findUserByEmail(email: string) {
        const user = await this.userRepository.findOneBy({
            email
        })
        return user
    }
    async findOneById(id: number) {
        const user = await this.userRepository.findOne({
            where: {id} 
         })
        if (!user) {
            throw new NotFoundException(`User not found`)
        }
        return user
    }
    async create(createUserDto: CreateUserDto) {
        let hashedPassword: string = ''
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const userObject = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            }
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
        const user = this.userRepository.create({ ...createUserDto, password: hashedPassword })
        return this.userRepository.save(user)
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto){
        const user = await this.projectsRepository.preload({
            id: +id,
            ...updateUserDto,   
        })
        if (!user) {
            throw new NotFoundException(`User not found`)
        }
        return this.projectsRepository.save(user)
    }
}
