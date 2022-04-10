import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  id: number;

  @IsNotEmpty()
  value: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
