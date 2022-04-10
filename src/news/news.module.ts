import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './controllers/news/news.controller';
import { NewsService } from './services/news/news.service';
import { CategoryController } from './controllers/category/category.controller';
import { CategoryService } from './services/category/category.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from './entities/Category';
import { News } from './entities/News';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, News]),
    forwardRef(() => AuthModule),
  ],
  controllers: [NewsController, CategoryController, UserController],
  providers: [NewsService, CategoryService, UserService],
  exports: [UserService, CategoryService],
})
export class NewsModule {}
