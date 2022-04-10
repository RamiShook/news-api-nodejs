import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'src/news/dtos/createCategory.dto';
import { Category } from 'src/news/entities/Category';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find({ take: 3 });
  }

  async findByValue(value: string) {
    return await this.categoryRepository.findOne({ value });
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new HttpException(
        'Category with this id not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async createCategory(categoryDto: CreateCategoryDto) {
    if (await this.findByValue(categoryDto.value))
      throw new HttpException(
        'Category value should be unique',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const category = this.categoryRepository.create(categoryDto);
    await this.categoryRepository.save(category);

    return plainToInstance(CreateCategoryDto, category);
  }

  async deleteById(id: number) {
    const deleteInfo = await this.categoryRepository.softDelete({
      id,
    });

    if (deleteInfo.affected < 1)
      throw new HttpException(
        'Category with this id not found',
        HttpStatus.NOT_FOUND,
      );

    return { message: 'Category Deleted' };
  }
}
