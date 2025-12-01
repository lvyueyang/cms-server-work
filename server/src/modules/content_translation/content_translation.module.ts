import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentTranslation } from './content_translation.entity';
import { ContentTranslationService } from './content_translation.service';
import { ContentTranslationController } from './content_translation.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ContentTranslation])],
  providers: [ContentTranslationService],
  controllers: [ContentTranslationController],
  exports: [ContentTranslationService],
})
export class ContentTranslationModule {}
