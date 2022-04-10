import { classToPlain, Exclude, instanceToPlain } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './Category';
import { User } from './User';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  desc: string;

  @Column({ nullable: false })
  content: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.news)
  user: User;

  @ManyToOne(() => Category, (category) => category.news)
  category: Category;
}
