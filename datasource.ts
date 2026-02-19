import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { Menus } from './src/menus/entity/menus.entity';
import { Projects } from './src/projects/entity/projects.entity';
import { Users } from './src/users/entity/user.entity';
import { Categories } from './src/menus/categories/entity/categories.entity';
import { MenuItems } from './src/menus/menu-items/entity/menu-items.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME ?? process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Projects, Menus, Categories, MenuItems],
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});