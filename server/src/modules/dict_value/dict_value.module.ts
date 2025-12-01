import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictValueController } from './dict_value.controller';
import { DictValue } from './dict_value.entity';
import { DictValueService } from './dict_value.service';
import { DictTypeModule } from '../dict_type/dict_type.module';

@Module({
  imports: [TypeOrmModule.forFeature([DictValue]), DictTypeModule],
  controllers: [DictValueController],
  providers: [DictValueService],
})
export class DictValueModule {}
