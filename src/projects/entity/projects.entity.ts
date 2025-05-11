import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

import { Exclude } from "class-transformer";
import { Users } from "src/users/entity/user.entity";


@Entity()
export class Projects {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    userId: number;

    
    @Column({ type: String, unique: true })
    title: string;

    @Column({  type: String  })
    description: string


    @Column({ type: String })
    logo: string
    
    @Column({ type: String, nullable: true })
    coverImage: string | null;
  
    

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;


   
  
    @ManyToOne(() => Users, user => user.projects)
    @JoinColumn({ name: 'userId' }) 
    user: Users;
} 