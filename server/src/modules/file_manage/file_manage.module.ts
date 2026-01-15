import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManageController } from './file_manage.controller';
import { FileManage } from './file_manage.entity';
import { FileManageService } from './file_manage.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileManage])],
  controllers: [FileManageController],
  providers: [FileManageService],
  exports: [FileManageService],
})
export class FileManageModule {}
