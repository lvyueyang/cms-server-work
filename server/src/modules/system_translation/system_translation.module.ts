import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemTranslationController } from './system_translation.controller';
import { SystemTranslation } from './system_translation.entity';
import { SystemTranslationService } from './system_translation.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemTranslation])],
  controllers: [SystemTranslationController],
  providers: [SystemTranslationService],
  exports: [SystemTranslationService],
})
export class SystemTranslationModule {}
