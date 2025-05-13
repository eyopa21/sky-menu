import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { Projects } from './entity/projects.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) { }

@Get()
  find(){
    return this.projectsService.getAll()
  }


  @Get(':id')
  @ApplyOwnershipMetadata(Projects, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOneById(+id)
  }

  @Post()
  createOne(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createOne(createProjectDto)
  }

  @Patch(':id')
  @ApplyOwnershipMetadata(Projects, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(+id, updateProjectDto)
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectsService.removeProject(+id)
  }


}
