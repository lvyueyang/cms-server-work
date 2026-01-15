import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictTypeController } from './dict_type.controller';
import { DictType } from './dict_type.entity';
import { DictTypeService } from './dict_type.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DictType])],
  controllers: [DictTypeController],
  providers: [DictTypeService],
  exports: [DictTypeService],
})
export class DictTypeModule {}
