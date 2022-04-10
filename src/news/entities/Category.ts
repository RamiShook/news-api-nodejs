import { classToPlain, Exclude, instanceToPlain } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { News } from './News';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => News, (news) => news.category, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  news: News[];

  toJSON() {
    return instanceToPlain(this);
  }
}
