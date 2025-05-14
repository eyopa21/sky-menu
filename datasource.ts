


import { Menus } from "src/menus/entity/menus.entity"
import { Projects } from "src/projects/entity/projects.entity"
import { Users } from "src/users/entity/user.entity"
import { DataSource } from "typeorm"

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // entities: ['dist/**/*.entity{.ts,.js}'],
    // migrations: ['dist/migrations/*{.ts,.js}'],
    entities: [Users, Projects, Menus],
    migrations: ['./src/migrations/*.ts'],

    migrationsTableName: "migrations",
})