import { Exclude } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';
import { Category } from '../entities/Category';
import { User } from '../entities/User';

export class CreateNewsDto {
  id: number;

  @IsNotEmpty()
  @MinLength(3)
  desc: string;

  @IsNotEmpty()
  @MinLength(5)
  content: string;

  @IsNotEmpty()
  category_id: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  user: User;

  category: Category;
}
