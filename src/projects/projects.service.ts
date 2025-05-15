import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { Repository } from 'typeorm';
import { Projects } from './entity/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { Users } from 'src/users/entity/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private readonly projectsRepository: Repository<Projects>,
        private readonly usersService: UsersService
    ) { }

    async getProjectsCount(userId: number) {
        const count = await this.projectsRepository.countBy({
            userId: userId
        })
        return count
    }

    async getAll() {
        return this.projectsRepository.find({
            relations: ['user', 'menu']
        })
    }

    async getMyProjects(userId: number){
        return this.projectsRepository.find({
            where: {
                userId
            }, 
            relations: ['menu', 'categories']
        })
    }

    async findOneById(id: number) {
        const project = await this.projectsRepository.findOne({
            where: { id }
        })
        if (!project) {
            throw new NotFoundException(`Project not found`)
        }
        return project
    }

    async createOne(createProjectDto: CreateProjectDto, user: Users) {

        const projectsCount = await this.getProjectsCount(user.id)
        if (projectsCount >= 5) {
            throw new BadRequestException('Maximum of 5 projects allowed');
        }
        const project = this.projectsRepository.create({
            ...createProjectDto, 
            userId: user.id
        })
        return this.projectsRepository.save(project)
    }

    async removeProject(id: number) {
        const project = await this.projectsRepository.findOneBy({
            id
        })
        if (!project) {
            throw new NotFoundException(`Project not found`)
        }
        return this.projectsRepository.remove(project)
    }

    async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
        const project = await this.projectsRepository.preload({
            id: +id,
            ...updateProjectDto,
        })
        if (!project) {
            throw new NotFoundException(`Project not found`)
        }
        return this.projectsRepository.save(project)
    }
}
