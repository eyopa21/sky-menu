
import { Projects } from "src/projects/entity/projects.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";



@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: Number, unique: true})
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

} 