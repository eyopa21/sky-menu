import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Projects } from 'src/projects/entity/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Projects])], 
  controllers: [UsersController],
  providers: [UsersService], 
  exports: [UsersService]
})
export class UsersModule {}
