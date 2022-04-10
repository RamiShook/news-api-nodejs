import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateNewsDto } from 'src/news/dtos/createNews.dto';
import { User } from 'src/news/entities/User';
import { NewsService } from 'src/news/services/news/news.service';
import { CurrentUser } from '../../utils/Decorators/currentUser';
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  createNews(@Body() createNewsDto: CreateNewsDto, @CurrentUser() user: User) {
    return this.newsService.createNews(createNewsDto, user);
  }

  @Get('')
  findAllNews() {
    return this.newsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.deleteById(id);
  }
}
