import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { OwnershipGuard } from 'src/common/guard/ownership.guard';
import { ApplyOwnershipMetadata } from 'src/common/guard/decorators/ownership.decorator';
import { Users } from './entity/user.entity';
import { InfinityPaginationResultType } from 'types/infinity-pagination-result';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<Users>> {
    const users = await this.userService.findAll(query);

    return {
      data: users,
      hasNextPage: users.length === query.limit,
    };
  }

  @Get(':id')
  @ApplyOwnershipMetadata(Users, 'user')
  @UseGuards(AuthGuard, OwnershipGuard)
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  // Register a user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApplyOwnershipMetadata(Users, 'Users')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }
}
