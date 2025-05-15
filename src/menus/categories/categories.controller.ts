import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { Categories } from './entity/categories.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Request } from 'express';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Get()
    findAll(){
        return this.categoriesService.findAll()
    }

    @Get('by-project/:projectId')
    @ApplyOwnershipMetadata(Categories, 'projects.user')
    @UseGuards(AuthGuard, OwnershipGuard)
    find(@Param('projectId') projectId: string){
        return this.categoriesService.findCategoriesByProjectId(+projectId)

    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createCategoryDto: CreateCategoryDto, @Req() request: Request){
        const userId = request.user.id
        return this.categoriesService.createOne(createCategoryDto, userId)
    }

    @Patch(':id')
    @ApplyOwnershipMetadata(Categories, 'projects.user')
    @UseGuards(AuthGuard, OwnershipGuard)
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto){
        return this.categoriesService.update(+id, updateCategoryDto )
    }

    @Delete(':id')
    @ApplyOwnershipMetadata(Categories, 'projects.user')
    @UseGuards(AuthGuard, OwnershipGuard)
    remove(@Param() id: string){
        return this.categoriesService.removeCategory(+id)
    }
}
