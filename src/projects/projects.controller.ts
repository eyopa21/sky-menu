import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { Projects } from './entity/projects.entity';
import { Request } from 'express';
import { Users } from 'src/users/entity/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('all')
  findAll() {
    return this.projectsService.getAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findOneBySlug(slug);
  }

  @Get()
  @UseGuards(AuthGuard)
  find(@Req() request: Request) {
    const userId = (request.user as Users).id;

    return this.projectsService.getMyProjects(+userId);
  }

  @Get(':id')
  @ApplyOwnershipMetadata(Projects, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOneById(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createOne(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: Request,
  ) {
    const user = request.user as Users;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.projectsService.createOne(createProjectDto, user);
  }

  @Patch(':id')
  @ApplyOwnershipMetadata(Projects, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(+id, updateProjectDto);
  }

  @ApplyOwnershipMetadata(Projects, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectsService.removeProject(+id);
  }
}
