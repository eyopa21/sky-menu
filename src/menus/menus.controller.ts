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
import { Request } from 'express';

import { MenusService } from './menus.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateMenuDto } from './dto/createMenu.dto';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { Menus } from './entity/menus.entity';
import { UpdateThemeDto } from './dto/updateTheme.dto';
import { Users } from 'src/users/entity/user.entity';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  @ApplyOwnershipMetadata(Menus, 'project.user')
  @UseGuards(AuthGuard, OwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.menusService.findOneById(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createMenuDto: CreateMenuDto, @Req() request: Request) {
    const user = request.user as Users;
    return this.menusService.createOne(createMenuDto, +user.id);
  }
  s;

  @Patch(':id')
  @ApplyOwnershipMetadata(Menus, 'project.user')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    return this.menusService.updateTheme(+id, updateThemeDto);
  }

  @Delete(':id')
  @ApplyOwnershipMetadata(Menus, 'project.user')
  @UseGuards(AuthGuard, OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.menusService.removeMenu(+id);
  }
}
