import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsAlphanumeric, IsByteLength, IsEmail, IsNotEmpty } from 'class-validator';
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
export class UserAdminCreateDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsByteLength(4, 16)
  readonly username: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty()
  @IsByteLength(6, 50)
  readonly password: string;

  @ApiProperty({
    description: '昵称',
  })
  @IsNotEmpty()
  @IsByteLength(2, 30)
  readonly cname: string;

  @ApiProperty({
    description: '邮箱',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

/** 更新 */
export class UserAdminUpdateDto extends PickType(UserAdminCreateDto, ['cname']) {}

/** 更新用户密码 */
export class UserAdminUpdatePasswordDto extends PickType(UserAdminCreateDto, ['password']) {}

export class UserAdminQueryInfoDto {
  @ApiProperty({
    description: '用户 ID',
  })
  id: number;
}

export class UserAdminParamsInfoDto {
  @ApiProperty({
    description: '用户 ID',
  })
  id: number;
}

export class UserAdminFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UserAdminCreateRootDto extends UserAdminCreateDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsEmail()
  readonly email: string;
}

export class UserAdminForgetPasswordDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty()
  readonly password: string;
}

export class UserAdminUpdateRolesDto {
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
