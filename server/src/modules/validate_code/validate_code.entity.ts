import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { VALIDATE_CODE_TYPE } from '@/constants';

/** 用户验证码 */
@Entity()
export class ValidateCode extends BaseEntity {
  @ApiProperty({
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  /** Key */
  @ApiProperty({
    description: 'Key',
  })
  @Column()
  key: string;

  /** 验证码 */
  @ApiProperty({
    description: '验证码',
  })
  @Column()
  code: string;

  /** 验证码用途 */
  @ApiProperty({
    description: '验证码用途',
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
