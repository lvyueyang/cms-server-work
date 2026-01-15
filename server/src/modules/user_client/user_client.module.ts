import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateCodeModule } from '../validate_code/validate_code.module';
import { UserClientController } from './user_client.controller';
import { UserClient } from './user_client.entity';
import { UserClientService } from './user_client.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserClient]), ValidateCodeModule],
  controllers: [UserClientController],
  providers: [UserClientService],
  exports: [UserClientService],
})
export class UserClientModule {}
