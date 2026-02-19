import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771509252568 implements MigrationInterface {
    name = 'Migration1771509252568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_sex_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'staff', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "date_of_birth" date NOT NULL, "phone_number" character varying NOT NULL, "sex" "public"."users_sex_enum" NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'owner', "isVerified" boolean NOT NULL DEFAULT false, "restaurantName" character varying, "slug" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_bc0c27d77ee64f0a097a5c269b3" UNIQUE ("slug"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_items" ("id" SERIAL NOT NULL, "menuId" integer NOT NULL, "categoryId" integer NOT NULL, "name" character varying NOT NULL, "images" text array NOT NULL DEFAULT '{}', "price" numeric NOT NULL, "vatIncluded" boolean NOT NULL DEFAULT true, "description" character varying, "isAvailable" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "calories" integer, "preparationTime" integer, "discount" numeric, "tags" text array, "allergens" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_fd4c1445b0fe7dfacf2416eb94a" UNIQUE ("categoryId", "name"), CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "imageUrl" character varying, "name" character varying NOT NULL, "description" character varying, "sortOrder" integer NOT NULL DEFAULT '0', "isVisible" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_bd0fee9bd09bb1fa68c515bcd88" UNIQUE ("projectId", "name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "logo" character varying NOT NULL, "coverImage" character varying, "currency" character varying(3) NOT NULL DEFAULT 'ETB', "primaryColor" character varying, "accentColor" character varying, "isPublished" boolean NOT NULL DEFAULT false, "address" character varying, "phone" character varying, "website" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_2117ba29bd245f2b53c42f429c9" UNIQUE ("title"), CONSTRAINT "UQ_96e045ab8b0271e5f5a91eae1ee" UNIQUE ("slug"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "name" character varying NOT NULL, "theme" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "language" character varying(5) NOT NULL DEFAULT 'en', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_44ac17db34a0b0cd4e77f4e9e6d" UNIQUE ("projectId"), CONSTRAINT "REL_44ac17db34a0b0cd4e77f4e9e6" UNIQUE ("projectId"), CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_44ac17db34a0b0cd4e77f4e9e6d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_44ac17db34a0b0cd4e77f4e9e6d"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_sex_enum"`);
    }

}
