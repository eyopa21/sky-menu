import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMenuItemDto } from './dto/createMenuItem.dto';
import { Request } from 'express';
import { MenuItemsService } from './menu-items.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UpdateMenuItemDto } from './dto/updateMenuItem.dto';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { MenuItems } from './entity/menu-items.entity';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { Users } from 'src/users/entity/user.entity';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @Req() request: Request,
  ) {
    const userId = (request.user as Users).id;
    return this.menuItemsService.createOne(createMenuItemDto, +userId);
  }

  @Patch(':id')
  @ApplyOwnershipMetadata(MenuItems, 'menu.project.user')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  @ApplyOwnershipMetadata(MenuItems, 'menu.project.user')
  @UseGuards(AuthGuard, OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(+id);
  }
}
