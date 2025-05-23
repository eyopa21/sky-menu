import { forwardRef, Module } from '@nestjs/common';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItems } from './entity/menu-items.entity';
import { MenusModule } from '../menus.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItems]),
    forwardRef(() => MenusModule),
    AuthModule,
    UsersModule,
    CategoriesModule,
    CommonModule,
  ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
