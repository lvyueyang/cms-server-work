import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentTranslationController } from './content_translation.controller';
import { ContentTranslation } from './content_translation.entity';
import { ContentTranslationService } from './content_translation.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ContentTranslation])],
  providers: [ContentTranslationService],
  controllers: [ContentTranslationController],
  exports: [ContentTranslationService],
})
export class ContentTranslationModule {}
