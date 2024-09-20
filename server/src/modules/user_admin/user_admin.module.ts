import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAdminController } from './user_admin.controller';
import { UserAdmin } from './user_admin.entity';
import { UserAdminService } from './user_admin.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserAdmin])],
  controllers: [UserAdminController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
