import { Module } from '@nestjs/common';
import { ResultPageController } from './result_page.controller';

@Module({
  controllers: [ResultPageController],
})
export class ResultPageModule {}
