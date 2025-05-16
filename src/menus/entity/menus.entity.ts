import { Projects } from 'src/projects/entity/projects.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItems } from '../menu-items/entity/menu-items.entity';

@Entity()
export class Menus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number, unique: true })
  projectId: number;

  @Column({ type: String })
  theme: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Projects, (project) => project.menu)
  @JoinColumn({ name: 'projectId' })
  project: Projects;

  @OneToMany(() => MenuItems, (menuItem) => menuItem.menu)
  menuItems: MenuItems;
}
