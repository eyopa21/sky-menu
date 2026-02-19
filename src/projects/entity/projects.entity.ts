import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Users } from 'src/users/entity/user.entity';
import { Menus } from 'src/menus/entity/menus.entity';
import { Categories } from 'src/menus/categories/entity/categories.entity';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: String, unique: true })
  title: string;

  @Column({ type: String, unique: true })
  slug: string;

  @Column({ type: String })
  description: string;

  @Column({ type: String })
  logo: string;

  @Column({ type: String, nullable: true })
  coverImage: string | null;

  @Column({ type: String, length: 3, default: 'ETB' })
  currency: string;

  @Column({ type: String, nullable: true })
  primaryColor: string | null;

  @Column({ type: String, nullable: true })
  accentColor: string | null;

  @Column({ type: Boolean, default: false })
  isPublished: boolean;

  @Column({ type: String, nullable: true })
  address: string | null;

  @Column({ type: String, nullable: true })
  phone: string | null;

  @Column({ type: String, nullable: true })
  website: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.projects)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToOne(() => Menus, (menu) => menu.project, { cascade: true })
  menu: Menus;

  @OneToMany(() => Categories, (category) => category.project, {
    cascade: true,
  })
  categories: Categories[];
}
