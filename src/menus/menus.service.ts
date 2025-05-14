import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Menus } from './entity/menus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/createMenu.dto';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class MenusService {
constructor(
    @InjectRepository(Menus)
    private readonly menusRepository: Repository<Menus>,

    private readonly projectsService: ProjectsService
){}


    findAll(){
        return this.menusRepository.find()
    }

    findMyMenus(projectId: number){
        return this.menusRepository.findBy({projectId})
    }

    async createOne(createMenuDto: CreateMenuDto, userId: number){
        const project = await this.projectsService.findOneById(createMenuDto.projectId)
        if(!project){
            throw new NotFoundException('Project not found')
        }
        if(project.userId !== userId){
            throw new ForbiddenException('You do not own this resource')
        }
        const menu = this.menusRepository.create({
            ...createMenuDto
        })
        return this.menusRepository.save(menu)
        
    }
}
