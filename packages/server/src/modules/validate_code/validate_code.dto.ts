import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';
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

/** 短信验证码 */
export class SMSValidateCodeCreateDto {
  @ApiProperty({
    description: '手机号',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN')
  readonly phone: string;

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
