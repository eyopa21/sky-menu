import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SEX } from '../constants/sex.enum';
import { Exclude } from 'class-transformer';
import { Projects } from 'src/projects/entity/projects.entity';

export enum UserRole {
  OWNER = 'owner',
  STAFF = 'staff',
  ADMIN = 'admin',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  full_name: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: String })
  phone_number: string;

  @Column({ type: 'enum', enum: SEX })
  sex: SEX;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: String, nullable: true })
  avatar: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OWNER,
  })
  role: UserRole;

  @Column({ type: Boolean, default: false })
  isVerified: boolean;

  @Column({ type: String, nullable: true })
  restaurantName: string | null;

  @Column({ type: String, unique: true, nullable: true })
  slug: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Projects, (project) => project.user, { cascade: true })
  projects: Projects[];
}
