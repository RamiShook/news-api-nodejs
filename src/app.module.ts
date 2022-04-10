import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import entities from './news/entities';
@Module({
  imports: [
    NewsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestdev',
      password: 'nestDevLocal@2020',
      database: 'nest_issa_news_api_one',
      entities: entities,
      synchronize: true, //@todo change this to false in production
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
