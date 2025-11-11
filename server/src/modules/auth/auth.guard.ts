import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiHeader } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { UserAdminService } from '../user_admin/user_admin.service';
import { AuthService } from './auth.service';
import { LOGIN_TYPE } from './auth.interface';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
    private userAdminService: UserAdminService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const loginType = this.reflector.get<LOGIN_TYPE>('loginType', context.getHandler());
    const req = context.switchToHttp().getRequest();
    const { headers } = req;
    const token = headers.token;
    if (!token) {
      throw new UnauthorizedException('token 不存在');
    }
    try {
      const tokenData = await this.authService.validateJwt(token);
      if (loginType !== tokenData.type) {
        throw new UnauthorizedException('token 类型错误');
      }
      const user = await this.userAdminService.findOneById(tokenData.id);

      // 退出登陆逻辑校验
      if (dayjs(tokenData.create_date).isBefore(dayjs(user.out_login_date))) {
        throw new UnauthorizedException('身份过期');
      }
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException(e?.message || '身份过期');
    }
  }
}

/** C 端用户登录校验 */
export function Login() {
  return applyDecorators(SetMetadata('loginType', LOGIN_TYPE.USER), UseGuards(LoginAuthGuard));
}

/** 管理后台登录 */
export function AdminLogin() {
  return applyDecorators(
    SetMetadata('loginType', LOGIN_TYPE.USER_ADMIN),
    UseGuards(LoginAuthGuard),
    ApiHeader({
      name: 'token',
      description: '用户 TOKEN',
    }),
  );
}
