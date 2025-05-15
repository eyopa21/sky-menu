
import { MenuItems } from "src/menus/menu-items/entity/menu-items.entity";
import { Projects } from "src/projects/entity/projects.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";



@Entity()
@Unique(['projectId', 'name']) // 👈 composite unique constraint
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: Number})
    projectId: number

    
    @Column({type: String, nullable: true})
    imageUrl: string

    @Column({ type: String })
    name: string;

    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => Projects, project => project.categories)
    @JoinColumn({ name: 'projectId' })
    project: Projects;

    @OneToMany(() => MenuItems, menuItem => menuItem.category)
    menuItem: MenuItems[]

} 