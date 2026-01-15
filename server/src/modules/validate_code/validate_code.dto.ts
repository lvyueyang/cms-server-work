import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty } from 'class-validator';
import { VALIDATE_CODE_TYPE } from '@/constants';
import { ResponseResult } from '@/interface';

/** 邮箱验证码 */
export class EmailValidateCodeCreateDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

class ValidateCodeSendDto {
  @ApiProperty({
    description: '图片验证码',
  })
  @IsNotEmpty({ message: '图片验证码不能为空' })
  readonly image_code: string;

  @ApiProperty({
    description: '图片验证码 HASH',
  })
  @IsNotEmpty()
  readonly image_code_hash: string;

  @ApiProperty({
    description: '验证码用途',
  })
  @IsNotEmpty()
  @IsEnum([
    VALIDATE_CODE_TYPE.ADMIN_USER_FORGET_PASSWORD,
    VALIDATE_CODE_TYPE.USER_CLIENT_FORGET_PASSWORD,
    VALIDATE_CODE_TYPE.USER_CLIENT_PHONE_REGISTER,
    VALIDATE_CODE_TYPE.USER_CLIENT_PHONE_LOGIN,
    VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_OLD,
    VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_NEW,
  ])
  readonly type: VALIDATE_CODE_TYPE;
}

/** 发送短信验证码 */
export class SMSValidateCodeSendDto extends ValidateCodeSendDto {
  @ApiProperty({
    description: '手机号',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN')
  readonly phone: string;
}

/** 发送邮箱验证码 */
export class EmailValidateCodeSendDto extends ValidateCodeSendDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  readonly email: string;
}

/** 图片验证码Response */
export class ImageValidateCodeResponseDto extends ResponseResult {
  data: {
    data: string;
    hash: string;
  };
}

/** 手机短信验证码 Response */
export class SmsCodeValidateCodeResponseDto extends ResponseResult {
  data: {
    hash: string;
  };
}
