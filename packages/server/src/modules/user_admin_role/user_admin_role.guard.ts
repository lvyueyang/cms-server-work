import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiHeader } from '@nestjs/swagger';
import { CodeItem } from 'src/common/common.permission';
import { LoginAuthGuard } from '../auth/auth.guard';
import { LOGIN_TYPE } from '../auth/interface';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { AdminRoleService } from './user_admin_role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private adminRoleService: AdminRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const codeItem = this.reflector.get<CodeItem>(
      'codeItem',
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserAdmin;
    if (user.is_root) {
      // 超管用户无需鉴权直接通过
      return true;
    }
    if (!user.roles.length) {
      throw new ForbiddenException('无操作权限');
    }
    const userCodes = await this.adminRoleService.ids2Codes(
      user.roles.map((r) => r.id),
    );
    if (!userCodes.includes(codeItem.code)) {
      throw new ForbiddenException('无操作权限');
    }
    return true;
  }
}

/** 管理后台角色认证 */
export function AdminRoleGuard(codeItem: CodeItem) {
  return applyDecorators(
    SetMetadata('loginType', LOGIN_TYPE.USER_ADMIN),
    UseGuards(LoginAuthGuard),
    ApiHeader({
      name: 'token',
      description: '用户 TOKEN',
    }),
    SetMetadata('codeItem', codeItem),
    UseGuards(RoleGuard),
  );
}
