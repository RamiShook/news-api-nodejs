import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { News } from 'src/news/entities/News';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto } from 'src/news/dtos/createNews.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/news/entities/User';
import { classToPlain, plainToInstance } from 'class-transformer';
import { SerializedUser } from 'src/news/dtos/serializedUser.dto';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDto } from 'src/news/dtos/createCategory.dto';
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async createNews(createNewsDto: CreateNewsDto, loggedUser: User) {
    const category = await this.categoryService.findById(
      createNewsDto.category_id,
    );
    if (!category)
      throw new HttpException(
        'Please choose a valid category',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const news = this.newsRepository.create({
      ...createNewsDto,
      user: loggedUser,
      category,
    });

    let savedNews = await this.newsRepository.save(news);

    return this.sanitizeNews(savedNews);
  }

  async findAll() {
    const savedNews = await this.newsRepository.find({
      relations: ['user', 'category'],
      withDeleted: false,
    });

    return savedNews.map((e) => {
      return this.sanitizeNews(e);
    });
  }

  async deleteById(id: number) {
    const deleteInfo = await this.newsRepository.softDelete({ id });
    if (deleteInfo.affected < 1)
      throw new HttpException(
        'Category with this id not found',
        HttpStatus.NOT_FOUND,
      );

    return { message: 'News Deleted' };
  }

  sanitizeNews(newsObj) {
    newsObj = plainToInstance(CreateNewsDto, newsObj);
    return {
      ...newsObj,
      user: plainToInstance(SerializedUser, newsObj.user),
      category: plainToInstance(CreateCategoryDto, newsObj.category),
    };
  }
}
