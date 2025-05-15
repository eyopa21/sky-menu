import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/createMenuItem.dto';
import { Request } from 'express';
import { MenuItemsService } from './menu-items.service';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('menu-items')
export class MenuItemsController {

    constructor(
        private readonly menuItemsService: MenuItemsService
    ){}


    @Get()
    findAll(){
        return this.menuItemsService.findAll()
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createMenuItemDto: CreateMenuItemDto, @Req() request: Request) {
        const userId = request.user.id
        return this.menuItemsService.createOne(createMenuItemDto, +userId)
    }
}
