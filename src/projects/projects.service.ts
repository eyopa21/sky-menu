import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    ) {}

    async getProjectsCount(userId: number){
        const count  = await this.projectsRepository.countBy({
            userId: 3
        })
        return count
    }
    async createOne(createProjectDto: CreateProjectDto) {
        const user = await this.usersService.findOneById(createProjectDto.userId)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const projectsCount = await this.getProjectsCount(createProjectDto.userId)
         if(projectsCount >= 5 ){
            throw new BadRequestException('Maximum of 5 projects allowed');
         }
        const project = this.projectsRepository.create({
            ...createProjectDto
        })
        return this.projectsRepository.save(project)
    }

   async removeProject(id: number){
        const project = await this.projectsRepository.findOneBy({ 
            id
         })
        if (!project) {
            throw new NotFoundException(`Project not found`)
        }
        console.log(project)
        return this.projectsRepository.remove(project)
    }
}
