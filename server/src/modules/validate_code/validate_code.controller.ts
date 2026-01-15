import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { successResponse } from '../../utils';
import { EmailValidateCodeSendDto, ImageValidateCodeResponseDto, SMSValidateCodeSendDto } from './validate_code.dto';
import {
  ValidateCodeByEmailService,
  ValidateCodeByImageService,
  ValidateCodeBySMSService,
  ValidateCodeService,
} from './validate_code.service';

@ApiTags('发送验证码')
@Controller()
export class ValidateCodeController {
  constructor(
    private services: ValidateCodeService,
    private smsServices: ValidateCodeBySMSService,
    private emailServices: ValidateCodeByEmailService,
    private imageServices: ValidateCodeByImageService
  ) {}

  @Get(['/api/image-validate-code', '/api/admin/image-validate-code'])
  @ApiOperation({ summary: '获取图片验证码' })
  @ApiResponse({ type: ImageValidateCodeResponseDto })
  async getImageValidateCode() {
    try {
      const { data, hash } = this.imageServices.create();
      return { data, hash };
    } catch (e) {
      console.log('e: ', e);
      throw new BadRequestException('图片验证码生成失败');
    }
  }

  @ApiOperation({ summary: '发送短信验证码' })
  @Post(['/api/validate-code/send/sms', '/api/admin/validate-code/send/sms'])
  async sendSmsCode(@Body() { phone, type, image_code, image_code_hash }: SMSValidateCodeSendDto) {
    if (!this.imageServices.validate(image_code_hash, image_code)) {
      throw new BadRequestException('图片验证码错误');
    }
    try {
      await this.smsServices.createAndSendCode(phone, type);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('e: ', e);
        throw new BadRequestException(e);
      }
      throw new BadRequestException('短信验证码发送失败');
    }
    return successResponse(null, '发送成功');
  }

  @ApiOperation({ summary: '发送邮箱验证码' })
  @Post(['/api/validate-code/send/email', '/api/admin/validate-code/send/email'])
  async sendEmailCode(@Body() { email, type, image_code, image_code_hash }: EmailValidateCodeSendDto) {
    if (!this.imageServices.validate(image_code_hash, image_code)) {
      throw new BadRequestException('图片验证码错误');
    }
    try {
      await this.emailServices.createAndSendCode('邮箱验证码', email, type);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        throw new BadRequestException(e);
      }
      throw new BadRequestException('邮箱验证码发送失败');
    }
    return successResponse(null, '发送成功');
  }
}
