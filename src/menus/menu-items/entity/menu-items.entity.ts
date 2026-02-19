import { Categories } from 'src/menus/categories/entity/categories.entity';
import { Menus } from 'src/menus/entity/menus.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column('text', { array: true, default: '{}' })
  images: string[];

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: Boolean, default: true })
  vatIncluded: boolean;

  @Column({ type: String, nullable: true })
  description: string | null;

  @Column({ type: Boolean, default: true })
  isAvailable: boolean;

  @Column({ type: Number, default: 0 })
  sortOrder: number;

  @Column({ type: Number, nullable: true })
  calories: number | null;

  @Column({ type: Number, nullable: true })
  preparationTime: number | null;

  @Column({ type: 'numeric', nullable: true })
  discount: number | null;

  @Column('text', { array: true, nullable: true })
  tags: string[] | null;

  @Column('text', { array: true, nullable: true })
  allergens: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Menus, (menu) => menu.menuItems)
  @JoinColumn({ name: 'menuId' })
  menu: Menus;

  @ManyToOne(() => Categories, (category) => category.menuItems)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;
}
