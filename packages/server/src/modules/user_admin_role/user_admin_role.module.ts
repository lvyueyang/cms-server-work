import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRoleController } from './user_admin_role.controller';
import { AdminRole } from './user_admin_role.entity';
import { AdminRoleService } from './user_admin_role.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AdminRole])],
  controllers: [AdminRoleController],
  providers: [AdminRoleService],
  exports: [AdminRoleService],
})
export class AdminRoleModule {}
