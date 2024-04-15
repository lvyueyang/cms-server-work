import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseResult } from 'src/interface';
import { UserAdminCreateDto } from 'src/modules/user_admin/user_admin.dto';

export class UserAdminLoginBody extends PickType(UserAdminCreateDto, ['password']) {
  @ApiProperty({
    description: '用户名/邮箱',
  })
  @IsNotEmpty()
  readonly username: string;
}

export class UserAdminLoginResponse extends ResponseResult {
  data: {
    token: string;
  };
}

export class UserAdminOutLoginResponse extends ResponseResult {}
