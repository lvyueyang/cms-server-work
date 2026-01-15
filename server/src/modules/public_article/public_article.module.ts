import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicArticleController } from './public_article.controller';
import { PublicArticle } from './public_article.entity';
import { PublicArticleService } from './public_article.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicArticle])],
  controllers: [PublicArticleController],
  providers: [PublicArticleService],
})
export class PublicArticleModule {}
