import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { SEX } from "../constants/sex.enum";
import { Exclude } from "class-transformer";


@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    full_name: string;

    @Column({ type: 'date' })
    date_of_birth: Date;


    @Column({  type: String  })
    phone_number: string

    
    @Column({ type: 'enum', enum: SEX })
    sex: SEX


    @Column({ type: String, unique: true })
    email: string


    @Column({  type: String  })
    @Exclude({ toPlainOnly: true })
    password: string


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;


} 