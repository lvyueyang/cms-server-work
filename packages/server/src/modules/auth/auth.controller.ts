import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/utils';
import { User } from '../user_admin/user-admin.decorator';
import { UserAdminService } from '../user_admin/user_admin.service';
import { AdminLogin } from './auth.guard';
import { AuthService } from './auth.service';
import { UserAdminLoginBody, UserAdminLoginResponse, UserAdminOutLoginResponse } from './auth.dto';

@Controller()
export class AuthController {
  constructor(
    private service: AuthService,
    private userAdminService: UserAdminService,
  ) {}

  @ApiTags('管理后台身份认证')
  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: UserAdminLoginResponse })
  @Post('/api/admin/login')
  async userAdminLogin(@Body() { username, password }: UserAdminLoginBody) {
    const user = await this.service.userAdminLogin(username, password);
    return successResponse({ token: user.access_token }, '登录成功');
  }

  @ApiTags('管理后台身份认证')
  @ApiOperation({ summary: '退出登录' })
  @ApiOkResponse({ type: UserAdminOutLoginResponse })
  @Post('/api/admin/outlogin')
  @AdminLogin()
  async userAdminOutLogin(@User() { id }) {
    await this.userAdminService.update(id, { out_login_date: new Date() });
    return successResponse(null, '退出登录成功');
  }
}
