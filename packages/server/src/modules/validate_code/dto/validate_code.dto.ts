import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/** 邮箱验证码 */
export class EmailValidateCodeCreateDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
