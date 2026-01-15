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
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { CodeItem, registerPermissionCode } from '@/common/common.permission';
import { PERM_CODE_METADATA } from '@/constants';
import { LoginAuthGuard } from '../auth/auth.guard';
import { LOGIN_TYPE } from '../auth/auth.interface';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { ApiMetadata, GuardOpt } from './user_admin_role.dto';
import { AdminRoleService } from './user_admin_role.service';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private adminRoleService: AdminRoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const codeItem = this.reflector.get<CodeItem>(PERM_CODE_METADATA, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserAdmin | null;
    if (!user) {
      throw new ForbiddenException('未登录');
    }
    if (user?.is_root) {
      // 超管用户无需鉴权直接通过
      return true;
    }
    if (!user.roles.length) {
      throw new ForbiddenException('无操作权限');
    }
    const userCodes = await this.adminRoleService.ids2Codes(user.roles.map((r) => r.id));
    if (!userCodes.includes(codeItem.code)) {
      throw new ForbiddenException('无操作权限');
    }
    return true;
  }
}

const createApiMetadata = (codeItem: CodeItem, opt?: GuardOpt): ApiMetadata => {
  const desc = `${opt?.desc ? opt?.desc + '\n' : ''}`;
  return {
    summary: opt?.summary ?? codeItem.cname,
    description: `${desc}关联角色: ${codeItem.cname} \n权限码: ${codeItem.code}`,
    codeItem,
    opt,
    desc,
  };
};

/** 管理后台角色认证 */
export function AdminRoleGuard(codeItem: CodeItem, opt?: GuardOpt) {
  const { summary, description } = createApiMetadata(codeItem, opt);
  registerPermissionCode(codeItem);
  return applyDecorators(
    ApiOperation({ summary, description }),
    SetMetadata('loginType', LOGIN_TYPE.USER_ADMIN),
    UseGuards(LoginAuthGuard),
    ApiHeader({
      name: 'token',
      description: '用户 TOKEN',
    }),
    SetMetadata(PERM_CODE_METADATA, codeItem),
    UseGuards(RoleGuard)
  );
}
