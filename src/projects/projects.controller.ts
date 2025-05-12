import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService
    ){}

    @Post()
    createOne(@Body() createProjectDto: CreateProjectDto){
       return this.projectsService.createOne(createProjectDto)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
      return this.projectsService.updateProject(+id, updateProjectDto)
    }

    @Delete(':id')
    deleteProject(@Param('id') id: string){
       return this.projectsService.removeProject(+id)
    }


}
