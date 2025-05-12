import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { Repository } from 'typeorm';
import { Projects } from './entity/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private readonly projectsRepository: Repository<Projects>,
        private readonly usersService: UsersService
    ) { }
    async createOne(createProjectDto: CreateProjectDto) {


        const user = await this.usersService.findOneById(createProjectDto.userId)

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const project = this.projectsRepository.create({
            ...createProjectDto
        })
        return this.projectsRepository.save(project)
    }
}
