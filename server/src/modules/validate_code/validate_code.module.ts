import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateCodeController } from './validate_code.controller';
import { ValidateCode } from './validate_code.entity';
import {
  ValidateCodeByEmailService,
  ValidateCodeByImageService,
  ValidateCodeBySMSService,
  ValidateCodeService,
} from './validate_code.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ValidateCode])],
  providers: [ValidateCodeService, ValidateCodeBySMSService, ValidateCodeByEmailService, ValidateCodeByImageService],
  controllers: [ValidateCodeController],
  exports: [ValidateCodeService, ValidateCodeBySMSService, ValidateCodeByEmailService, ValidateCodeByImageService],
})
export class ValidateCodeModule {}
