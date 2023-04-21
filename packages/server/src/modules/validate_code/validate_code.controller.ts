import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_PONIT_TYPE, VALIDATE_CODE_TYPE } from 'src/constants';
import { successResponse } from 'src/utils';
import { RenderViewService } from '../render_view/render_view.service';
import { UserAdminService } from '../user_admin/user_admin.service';
import { EmailValidateCodeCreateDto } from './dto/validate_code.dto';
import { ValidateCodeService } from './validate_code.service';

@ApiTags('发送验证码')
@Controller()
export class ValidateCodeController {
  constructor(
    private services: ValidateCodeService,
    private RenderViewServices: RenderViewService,
    private userAdminServices: UserAdminService,
  ) {}

  @Post('/api/admin/send-validate-code/forget-password/')
  @ApiOperation({ summary: '管理员账号忘记密码发送验证码' })
  async create(@Body() { email }: EmailValidateCodeCreateDto) {
    const user = await this.userAdminServices.findOneByEmail(email);
    const res = await this.services.create({
      user_id: user.id,
      code_type: VALIDATE_CODE_TYPE.FORGET_PASSWORD,
      point_type: USER_PONIT_TYPE.AMDIN,
    });
    const content = this.RenderViewServices.render('validate_code_template', {
      title: '密码重置',
      type: '邮箱验证码',
      code: res.code,
    });

    await this.services.senEmail({
      to: user.email,
      title: '密码重置验证码',
      content,
    });
    return successResponse(null, '发送成功');
  }
}
