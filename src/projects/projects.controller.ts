import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/createProject.dto';

@Controller('projects')
export class ProjectsController {

    constructor(
        private readonly projectsService: ProjectsService
    ){}

    @Post()
    createOne(@Body() createProjectDto: CreateProjectDto){
       return this.projectsService.createOne(createProjectDto)
    }

}
