import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categories } from './entity/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private readonly projectsService: ProjectsService,
  ) {}

  async findAll() {
    return this.categoriesRepository.find();
  }

  findCategoriesByProjectId(projectId: number) {
    const categories = this.categoriesRepository.findBy({ projectId });
    return categories;
  }

  async findOneById(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createOne(createCategoryDto: CreateCategoryDto, userId: number) {
    const project = await this.projectsService.findOneById(
      createCategoryDto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this resource');
    }
    const category = this.categoriesRepository.create(createCategoryDto);

    return await this.categoriesRepository.save(category);
  }

  async removeCategory(id: number) {
    const category = await this.findOneById(id);
    return this.categoriesRepository.remove(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoriesRepository.save(category);
  }
}
