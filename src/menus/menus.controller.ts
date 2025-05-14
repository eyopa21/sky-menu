import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { MenusService } from './menus.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateMenuDto } from './dto/createMenu.dto';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { Projects } from 'src/projects/entity/projects.entity';

@Controller('menus')
export class MenusController {

    constructor(
        private readonly menusService: MenusService
    ){}

    findAll(@Req() request: Request){
        return this.menusService.findAll()
    }

    @Post()
    @ApplyOwnershipMetadata(Projects, 'user')
    @UseGuards(AuthGuard)
    create(@Body() createMenuDto: CreateMenuDto, @Req() request: Request){
        const user = request.user
        return this.menusService.createOne(createMenuDto, user.id)
    }

}
