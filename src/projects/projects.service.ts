import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { Repository } from 'typeorm';
import { Projects } from './entity/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
constructor(
    @InjectRepository(Projects)
    private readonly projectsRepository: Repository<Projects>
){}
    createOne(createProjectDto: CreateProjectDto){

        return this.projectsRepository.findOne({
            where: 
        })
    }
}
