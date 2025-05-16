import { Categories } from 'src/menus/categories/entity/categories.entity';
import { Menus } from 'src/menus/entity/menus.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['categoryId', 'name'])
export class MenuItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number })
  menuId: number;

  @Column({ type: Number })
  categoryId: number;

  @Column({ type: String })
  name: string;

  @Column('text', { array: true })
  images: string[];

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: Boolean, default: true })
  vatIncluded: boolean;

  @Column({ type: String, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Menus, (menu) => menu.menuItems)
  @JoinColumn({ name: 'menuId' })
  menu: Menus;

  @ManyToOne(() => Categories, (category) => category.menuItem)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;
}
