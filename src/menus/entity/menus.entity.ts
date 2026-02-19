import { Projects } from 'src/projects/entity/projects.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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
  name: string;

  @Column({ type: String })
  theme: string;

  @Column({ type: Boolean, default: true })
  isActive: boolean;

  @Column({ type: String, length: 5, default: 'en' })
  language: string;

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
  menuItems: MenuItems[];
}
