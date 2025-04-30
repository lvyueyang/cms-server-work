import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Pagination, ResponseResult } from '@/interface';
import { AdminRole } from './user_admin_role.entity';
import { CodeItem } from '@/common/common.permission';

export class AdminRoleInfo extends OmitType(AdminRole, ['users']) {}
class AdminRoleList {
  list: AdminRoleInfo[];
  total: number;
}

/** 新增 */
export class AdminRoleCreateDto extends PickType(AdminRole, ['name', 'desc']) {}

/** 更新权限码 */
export class AdminRoleUpdatePermissionCodeDto {
  @ApiProperty({
    description: '权限码',
  })
  codes: AdminRoleInfo['permission_code'];
}

/** 修改 */
export class AdminRoleUpdateDto extends AdminRoleCreateDto {}

/** 查询 */
export class AdminRoleQueryListDto extends Pagination {}

/** 查询 Params */
export class AdminRoleParamsInfoDto {
  @ApiProperty({
    description: '角色 ID',
  })
  id: AdminRoleInfo['id'];
}

/** 角色 ID Response */
export class AdminRoleIdResponseDto extends ResponseResult<number> {
  @ApiProperty({
    description: '角色 ID',
  })
  readonly data: number;
}

/** 单个角色 Response */
export class AdminRoleInfoResponseDto extends ResponseResult<AdminRoleInfo> {
  @ApiProperty({
    description: '角色详情',
  })
  readonly data: AdminRoleInfo;
}

/** 角色列表 Response */
export class AdminRoleListResponseDto extends ResponseResult<AdminRoleList> {
  data: AdminRoleList;
}

class CodeInfo {
  code: string;
  cname: string;
}

/** 权限码列表 Response */
export class AdminPermissionCodeListResponseDto extends ResponseResult {
  data: CodeInfo[];
}

export class GuardOpt {
  /** 接口名称 */
  @ApiProperty()
  summary?: string;
  /** 接口备注 */
  @ApiProperty()
  desc?: string;
  /** 不需要查询条件 */
  @ApiProperty()
  not_query_params?: boolean;
}

export class ApiMetadata {
  @ApiProperty()
  summary: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  codeItem: CodeItem;
  @ApiProperty()
  opt?: GuardOpt;
  @ApiProperty()
  desc?: string;
}
