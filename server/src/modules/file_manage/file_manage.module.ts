import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManageController } from './file_manage.controller';
import { FileManage } from './file_manage.entity';
import { FileManageService } from './file_manage.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileManage])],
  controllers: [FileManageController],
  providers: [FileManageService],
})
export class FileManageModule {}
