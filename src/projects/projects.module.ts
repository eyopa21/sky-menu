import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './entity/projects.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
   imports: [TypeOrmModule.forFeature([Projects]), UsersModule], 
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
