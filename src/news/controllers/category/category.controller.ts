import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/news/dtos/createCategory.dto';
import { CategoryService } from 'src/news/services/category/category.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('news/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/value/:value')
  findByValue(@Param('value') value: string) {
    let category = this.categoryService.findByValue(value);
    if (category) return category;
    else throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  @Get('/id/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteCategoty(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteById(id);
  }
}
