import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MenuItems } from './entity/menu-items.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuItemDto } from './dto/createMenuItem.dto';
import { MenusService } from '../menus.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class MenuItemsService {

    constructor(
        @InjectRepository(MenuItems)
        private readonly menuItemsRepository: Repository<MenuItems>,

        private readonly menusService: MenusService, 

        private readonly categoriesService: CategoriesService

    ) { }


    findAll(){
        return this.menuItemsRepository.find({
            relations: ['category', 'menu']
        })
    }

    async createOne(createMenuItemDto: CreateMenuItemDto, userId: number) {
        const menu = await this.menusService.findOneById(createMenuItemDto.menuId)
        const category = await this.categoriesService.findOneById(createMenuItemDto.categoryId)
      
        if (menu?.project.userId !== userId || category.projectId !== menu.projectId) {
            throw new ForbiddenException('You do not own this resource')
        }

        const menuItem = this.menuItemsRepository.create({ ...createMenuItemDto })
        return this.menuItemsRepository.save(menuItem)
    }
}
