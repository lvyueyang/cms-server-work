import { Body, Controller, Get, Inject, Ip, Post, Query, Res } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createPermGroup } from '@/common/common.permission';
import { userConfig } from '@/config';
import { FE_PREFIX, VALIDATE_CODE_TYPE } from '@/constants';
import { passwordCrypto, successResponse } from '@/utils';
import { createResultPageUrl, LoginPage, RegisterPage, ResetPasswordPage } from '@/views';
import { Token } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';
import { TrackService } from '../track/track.service';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { ValidateCodeBySMSService } from '../validate_code/validate_code.service';
import {
  UserClientListResponseDto,
  UserClientLoginByCodeDto,
  UserClientLoginByPasswordDto,
  UserClientQueryListDto,
  UserClientRegisterDto,
  UserClientResetPasswordDto,
} from './user_client.dto';
import { UserClient } from './user_client.entity';
import { UserClientService } from './user_client.service';

const MOD_NAME = '客户端用户';
const createPerm = createPermGroup(MOD_NAME);

@ApiTags(MOD_NAME)
@Controller()
export class UserClientController {
  constructor(
    private service: UserClientService,
    private validateCodeBySMSService: ValidateCodeBySMSService,
    private trackService: TrackService,
    private authService: AuthService,

    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>
  ) {}

  @Post('/api/admin/client-user/list')
  @ApiOkResponse({
    type: UserClientListResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:client-user:list', `获取${MOD_NAME}列表`))
  async list(@Body() pagination: UserClientQueryListDto) {
    const [list, total] = await this.service.findList(pagination);
    return successResponse({ list, total });
  }

  @Get('/reset-password')
  @RenderView()
  resetPasswordPage() {
    return new RenderViewResult({
      title: '重置密码',
      scripts: [],
      styles: [`${FE_PREFIX}/login.css`],
      layout: 'base',
      render() {
        return <ResetPasswordPage />;
      },
    });
  }

  @Post('/reset-password')
  @ApiOperation({ summary: '客户端用户重置密码' })
  async resetPassword(
    @Body() data: UserClientResetPasswordDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // 密码为 8-20个数字或字母组合，特殊符号仅允许出现(_@#)
    if (!/^[a-zA-Z0-9_@#]{8,20}$/.test(data.password)) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '密码格式错误',
          description: '密码必须为8-20个数字或字母组合，特殊符号仅允许出现(_@#)',
          type: 'back',
        })
      );
      return;
    }
    const [_, v] = await this.validateCodeBySMSService.validateCode({
      phone: data.phone,
      code: data.code,
      type: VALIDATE_CODE_TYPE.USER_CLIENT_FORGET_PASSWORD,
    });
    if (v) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '验证码错误',
          type: 'back',
        })
      );
      return;
    }
    try {
      const user = await this.service.findOneByPhone(data.phone);
      if (!user) {
        response.redirect(
          createResultPageUrl({
            status: 'error',
            title: '当前手机号未注册',
            description: '点击下方按钮进行注册',
            type: 'user_register',
          })
        );
        return;
      }
      await this.service.updatePassword(user.id, this.passwordCrypto(data.password));
      this.trackService.create({
        event: 'client_user_reset_password',
        properties: {
          phone: user.phone,
          ip,
        },
      });
      response.redirect(
        createResultPageUrl({
          status: 'success',
          title: '重置成功',
          description: '点击下方按钮去登录',
          type: 'user_login',
        })
      );
    } catch (e: any) {
      console.log('e: ', e);
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: `重置密码失败`,
          description: e.message || '服务器错误',
          type: 'back',
        })
      );
    }
  }
  @Get('/register')
  @RenderView()
  registerPage() {
    return new RenderViewResult({
      title: '注册',
      scripts: [],
      styles: [`${FE_PREFIX}/login.css`],
      layout: 'base',
      render(ctx) {
        return <RegisterPage />;
      },
    });
  }

  // 客户端用户注册
  @Post('/register')
  @ApiOperation({ summary: '客户端用户注册' })
  async register(
    @Body() data: UserClientRegisterDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // 密码为 8-20个数字或字母组合，特殊符号仅允许出现(_@#)
    if (!/^[a-zA-Z0-9_@#]{8,20}$/.test(data.password)) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '密码格式错误',
          description: '密码必须为8-20个数字或字母组合，特殊符号仅允许出现(_@#)',
          type: 'back',
        })
      );
      return;
    }
    const [_, v] = await this.validateCodeBySMSService.validateCode({
      phone: data.phone,
      code: data.code,
      type: VALIDATE_CODE_TYPE.USER_CLIENT_PHONE_REGISTER,
    });
    if (v) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '验证码错误',
          type: 'back',
        })
      );
      return;
    }
    try {
      await this.service.usePhoneCreate(data.phone, this.passwordCrypto(data.password));
      this.trackService.create({
        event: 'client_user_register',
        properties: {
          phone: data.phone,
          ip,
        },
      });
      response.redirect(
        createResultPageUrl({
          status: 'success',
          title: '注册成功',
          description: '点击下方按钮进行登录',
          type: 'user_login',
        })
      );
    } catch (e: any) {
      console.log('e: ', e);
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: `注册失败`,
          description: e.message || '服务器错误',
          type: 'back',
        })
      );
    }
  }

  passwordCrypto(password: string) {
    if (!this.config.passwordClientSalt) {
      throw new Error('密码盐未配置');
    }
    return passwordCrypto(password, this.config.passwordClientSalt);
  }

  @Get('/login')
  @RenderView()
  loginPage(@Query() { message }: { message?: string }) {
    return new RenderViewResult({
      title: '登录',
      scripts: [`${FE_PREFIX}/login.js`],
      styles: [`${FE_PREFIX}/login.css`],
      layout: 'base',
      render(ctx) {
        return <LoginPage message={message} />;
      },
    });
  }

  @Get('/logout')
  logoutPage(
    @Query() { redirect_uri }: { redirect_uri: string },
    @Res({ passthrough: true }) response: Response,
    @Token() token: string,
    @Ip() ip: string
  ) {
    response.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    this.authService.userClientIsLogin({ token }).then((res) => {
      const [user] = res;
      this.trackService.create({
        event: 'client_user_logout',
        properties: {
          ip,
        },
        userId: user?.id,
      });
    });

    response.cookie('user_cname', '');
    response.cookie('user_id', '');
    response.redirect(redirect_uri || '/');
  }

  @Post('/login/password')
  @ApiOperation({ summary: '客户端用户密码登录' })
  async loginByPassword(
    @Body() data: UserClientLoginByPasswordDto,
    @Query() { redirect_uri }: { redirect_uri: string },
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.service.findOneByPhone(data.phone);
    if (!user) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '手机号未注册',
          description: '点击下方按钮进行注册',
          type: 'user_register',
        })
      );
      return;
    }
    try {
      await this.service.validatePassword(data.phone, this.passwordCrypto(data.password));
    } catch (e) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '手机号或密码错误',
          type: 'back',
        })
      );
      return;
    }
    await this.login(response, user, data.redirect_uri || redirect_uri);
    this.trackService.create({
      event: 'client_user_login',
      properties: {
        phone: data.phone,
        login_type: 'use_password',
        ip,
      },
    });
  }

  // 客户端用户短信验证码登录
  @Post('/login/code')
  @ApiOperation({ summary: '客户端用户短信验证码登录' })
  async loginByCode(
    @Body() data: UserClientLoginByCodeDto,
    @Query() { redirect_uri }: { redirect_uri: string },
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const [_, vali] = await this.validateCodeBySMSService.validateCode({
      phone: data.phone,
      code: data.code,
      type: VALIDATE_CODE_TYPE.USER_CLIENT_PHONE_LOGIN,
    });
    if (vali) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '验证码错误',
          type: 'back',
        })
      );
      return;
    }
    const user = await this.service.findOneByPhone(data.phone);
    await this.login(response, user, data.redirect_uri || redirect_uri);
    this.trackService.create({
      event: 'client_user_login',
      properties: {
        phone: data.phone,
        login_type: 'use_sms_code',
        ip,
      },
    });
  }

  private async login(response: Response, user?: UserClient | null, redirect_uri?: string) {
    if (!user) {
      response.redirect(
        createResultPageUrl({
          status: 'error',
          title: '手机号未注册',
          description: '点击下方按钮进行注册',
          type: 'user_register',
        })
      );
      return;
    }
    const { access_token } = await this.service.userLogin(user);
    response.cookie('token', access_token, { httpOnly: true });
    response.cookie('user_cname', user.cname);
    response.cookie('user_id', user.id);
    response.redirect(redirect_uri || '/');
  }
}
