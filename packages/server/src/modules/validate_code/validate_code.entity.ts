import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/base.entity';
import { USER_PONIT_TYPE, VALIDATE_CODE_TYPE } from 'src/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 用户验证码 */
@Entity()
export class ValidateCode extends BaseEntity {
  @ApiProperty({
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  /** 账号类型 */
  @ApiProperty({
    description: '账号类型',
  })
  @Column()
  point_type: USER_PONIT_TYPE;

  /** 用户 ID */
  @ApiProperty({
    description: '用户 ID',
  })
  @Column()
  user_id: number;

  /** 验证码 */
  @ApiProperty({
    description: '验证码',
  })
  @Column()
  code: string;

  /** 验证码类型 */
  @ApiProperty({
    description: '验证码类型',
  })
  @Column()
  code_type: VALIDATE_CODE_TYPE;

  /** 过期时间 */
  @ApiProperty({
    description: '过期时间',
  })
  @Column()
  expire_date: Date;
}
