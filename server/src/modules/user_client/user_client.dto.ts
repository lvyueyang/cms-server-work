import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseResult } from '@/interface';
import { UserClient } from './user_client.entity';

export class UserClientInfo extends OmitType(UserClient, ['password']) {}

class UserClientList {
  list: UserClient[];
  total: number;
}

/** 查询 */
export class UserClientQueryListDto extends Pagination {}

export class UserClientRegisterDto extends PickType(UserClient, ['phone', 'password']) {
  @ApiProperty({
    description: '短信验证码',
  })
  @IsNotEmpty()
  readonly code: string;
}

// 重置密码
export class UserClientResetPasswordDto extends UserClientRegisterDto {}

// 手机号+密码登录
export class UserClientLoginByPasswordDto extends PickType(UserClient, ['phone', 'password']) {
  @ApiProperty({
    description: '回调地址',
  })
  readonly redirect_uri?: string;
}

// 手机号+短信验证码登录
export class UserClientLoginByCodeDto extends PickType(UserClient, ['phone']) {
  @ApiProperty({
    description: '短信验证码',
  })
  @IsNotEmpty()
  readonly code: string;
  @ApiProperty({
    description: '回调地址',
  })
  readonly redirect_uri?: string;
}

export class UserClientListResponseDto extends ResponseResult {
  readonly data: UserClientList;
}
