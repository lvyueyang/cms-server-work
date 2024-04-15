import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseResult } from 'src/interface';
import { AdminRole } from './user_admin_role.entity';

export class AdminRoleInfo extends OmitType(AdminRole, ['users']) {}
class AdminRoleList {
  list: AdminRoleInfo[];
  total: number;
}

/** 新增 */
export class AdminRoleCreateDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsNotEmpty()
  readonly name: AdminRole['name'];

  @ApiProperty({
    description: '角色描述',
  })
  readonly desc?: AdminRole['desc'];
}

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
