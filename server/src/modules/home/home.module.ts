import { Module } from '@nestjs/common';
import { BannerModule } from '../banner/banner.module';
import { NewsModule } from '../news/news.module';
import { HomeController } from './home.controller';

@Module({
  imports: [BannerModule, NewsModule],
  controllers: [HomeController],
})
export class HomeModule {}
