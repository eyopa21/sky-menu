import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menus } from './entity/menus.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menus]), ProjectsModule, UsersModule, AuthModule, CategoriesModule],
  providers: [MenusService],
  controllers: [MenusController]
})
export class MenusModule {}
