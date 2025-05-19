import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { UsersController } from './users.controller';
import { Projects } from 'src/projects/entity/projects.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});
describe('UsersService', ()  => {
  let userService: UsersService;
  let coffeeRepository: MockRepository

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule, AuthModule, CommonModule],
      providers: [
        UsersService,
        UsersController,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Projects),
          useValue: {},
        },
      ],
    }).compile();

    userService = app.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userService.findAll({})).toBe('Hello World!');
    });
  });
});
