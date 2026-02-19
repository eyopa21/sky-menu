import { MenuItems } from 'src/menus/menu-items/entity/menu-items.entity';
import { Projects } from 'src/projects/entity/projects.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['projectId', 'name'])
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number })
  projectId: number;

  @Column({ type: String, nullable: true })
  imageUrl: string | null;

  @Column({ type: String })
  name: string;

  @Column({ type: String, nullable: true })
  description: string | null;

  @Column({ type: Number, default: 0 })
  sortOrder: number;

  @Column({ type: Boolean, default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Projects, (project) => project.categories)
  @JoinColumn({ name: 'projectId' })
  project: Projects;

  @OneToMany(() => MenuItems, (menuItem) => menuItem.category)
  menuItems: MenuItems[];
}
