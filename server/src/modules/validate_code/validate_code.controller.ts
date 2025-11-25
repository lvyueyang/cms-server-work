import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SMS_CODE_KEY, USER_PONIT_TYPE, VALIDATE_CODE_TYPE } from '@/constants';
import { successResponse } from '../../utils';
import { UserAdminService } from '../user_admin/user_admin.service';
import {
  EmailValidateCodeCreateDto,
  ImageValidateCodeResponseDto,
  SMSValidateCodeCreateDto,
} from './validate_code.dto';
import { ValidateCodeService } from './validate_code.service';

@ApiTags('发送验证码')
@Controller()
export class ValidateCodeController {
  constructor(
    private services: ValidateCodeService,
    private userAdminServices: UserAdminService,
  ) {}

  @Post('/api/admin/send-validate-code/forget-password/')
  @ApiOperation({ summary: '管理员账号忘记密码发送验证码' })
  async forgetPassword(@Body() { email }: EmailValidateCodeCreateDto) {
    const user = await this.userAdminServices.findOneByEmail(email);
    const res = await this.services.create({
      user_id: user.id,
      code_type: VALIDATE_CODE_TYPE.FORGET_PASSWORD,
      point_type: USER_PONIT_TYPE.AMDIN,
    });
    const ctx = {
      title: '密码重置',
      type: '邮箱验证码',
      code: res.code,
    };
    const content = `<div style="width: 600px;margin: 20px auto;color:#000;background:#fff;border: 1px solid #415A94;">
  <div style="padding-left:30px;background-color:#415A94;color:#fff;padding:20px 40px;font-size: 21px;">${ctx.title}</div>
  <div style="padding:40px;">
    <div style="font-size:24px;line-height:1.5;">${ctx.type}</div>
    <div style="margin-top: 15px;">
      <span>您的验证码是：</span>
      <span style="padding: 0 3px;font-size: 18px;">
        <b>${ctx.code}</b>
      </span>
      <span>，请在 5 分钟内进行验证。如果该验证码不为您本人申请，请无视。</span>
    </div>
  </div>
</div>`;

    await this.services.senEmail({
      to: user.email,
      title: '密码重置验证码',
      content,
    });
    return successResponse(null, '发送成功');
  }

  @Get('/api/image-validate-code')
  @ApiOperation({ summary: '获取图片验证码' })
  @ApiResponse({ type: ImageValidateCodeResponseDto })
  async getImageValidateCode() {
    const { data, hash } = this.services.createImageCode();
    return { data, hash };
  }

  async sendSmsCodeCommon(
    { phone, image_code, image_code_hash }: SMSValidateCodeCreateDto,
    key: string,
  ) {
    const isValidate = this.services.validateHashCode(image_code_hash, image_code);
    if (!isValidate) {
      throw new BadRequestException('图片验证码错误');
    }
    const { hash, code } = await this.services.createPhoneHashCode(phone, key);
    await this.services.sendSmsCode(phone, code);
    return successResponse(
      {
        hash,
      },
      '发送成功',
    );
  }

  @Post('/api/send-sms-code/login')
  @ApiOperation({ summary: '用户登录发送短信验证码' })
  @ApiResponse({ type: ImageValidateCodeResponseDto })
  async sendLoginSMS(@Body() body: SMSValidateCodeCreateDto) {
    return await this.sendSmsCodeCommon(body, SMS_CODE_KEY.USER_LOGIN);
  }
}
