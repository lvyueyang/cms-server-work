import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseResult } from '@/interface';
import { UserAdmin } from './user_admin.entity';

export class UserAdminInfo extends UserAdmin {}

class UserAdminList {
  list: UserAdminInfo[];
  total: number;
}

/** Request */

/** 查询 */
export class UserAdminQueryListDto extends Pagination {}

/** 新增 */
export class UserAdminCreateDto extends PickType(UserAdmin, ['username', 'password', 'cname', 'email']) {}

/** 更新 */
export class UserAdminUpdateDto extends PickType(UserAdminInfo, ['cname', 'id', 'avatar']) {}

/** 更新用户密码 */
export class UserAdminUpdatePasswordDto extends PickType(UserAdmin, ['password', 'id']) {}

export class UserAdminQueryInfoDto extends PickType(UserAdminInfo, ['id']) {}

export class UserAdminParamsInfoDto extends PickType(UserAdminInfo, ['id']) {}

export class UserAdminFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UserAdminCreateRootDto extends PickType(UserAdmin, ['email', 'cname', 'password', 'username']) {}

export class UserAdminForgetPasswordDto extends PickType(UserAdmin, ['email', 'password']) {
  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty()
  readonly code: string;
}

export class UserAdminUpdateRolesDto extends PickType(UserAdminInfo, ['id']) {
  @ApiProperty({
    description: '角色 ID',
  })
  @IsNotEmpty()
  readonly roles: number[];
}

/** Response */

export class UserAdminIdResponseDto extends ResponseResult {
  @ApiProperty({
    description: '用户 ID',
  })
  readonly data: number;
}

export class UserAdminInfoResponseDto extends ResponseResult {
  readonly data: UserAdminInfo;
}

export class UserAdminListResponseDto extends ResponseResult {
  readonly data: UserAdminList;
}

// 邮箱换绑
export class UserAdminBindEmailDto {
  @ApiProperty({
    description: '旧邮箱验证码',
  })
  @IsNotEmpty()
  readonly old_email_code: string;

  @ApiProperty({
    description: '新邮箱',
  })
  @IsNotEmpty()
  readonly new_email: string;

  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty()
  readonly new_email_code: string;
}
