import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { createLoginPageUrl } from '@/views';
import { LOGIN_TYPE } from './auth.interface';
import { AuthService } from './auth.service';
@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const loginType = this.reflector.get<LOGIN_TYPE>('loginType', context.getHandler());
    const req = context.switchToHttp().getRequest();
    const token = getToken(req);
    if (loginType === LOGIN_TYPE.USER_ADMIN) {
      const [user, errMsg] = await this.authService.userAdminIsLogin({ token });
      if (errMsg) {
        throw new UnauthorizedException(errMsg);
      }
      req.user = user;
      return true;
    }
    if (loginType === LOGIN_TYPE.USER_CLIENT) {
      const [user, errMsg] = await this.authService.userClientIsLogin({
        token,
      });
      if (errMsg) {
        req.redirect(
          createLoginPageUrl({
            redirect_uri: req.originalUrl,
          })
        );

        return false;
      }
      req.user = user;
      return true;
    }
    return false;
  }
}

/** C 端用户登录校验 */
export function ClientLogin() {
  return applyDecorators(SetMetadata('loginType', LOGIN_TYPE.USER_CLIENT), UseGuards(LoginAuthGuard));
}

/** 管理后台登录 */
export function AdminLogin() {
  return applyDecorators(
    SetMetadata('loginType', LOGIN_TYPE.USER_ADMIN),
    UseGuards(LoginAuthGuard),
    ApiHeader({
      name: 'token',
      description: '用户 TOKEN',
    })
  );
}

/** 获取Token */
export const Token = createParamDecorator((_data: unknown, ctx: ExecutionContext): string | undefined => {
  const req = ctx.switchToHttp().getRequest() as Request;
  return getToken(req);
});

function getToken(req: Request) {
  let token = req.headers?.token as string | undefined;
  if (!token) {
    token = req.cookies?.['token'];
  }
  return token;
}
