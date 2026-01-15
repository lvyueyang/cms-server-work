import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { TrackEvent } from '../track/track.entity';

@Entity({ orderBy: { create_date: 'DESC' } })
export class UserClient extends BaseEntity {
  @ApiProperty({
    description: '客户端端用户 ID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '用户名',
  })
  @Column()
  username: string;

  /** 用户密码 */
  @ApiProperty({
    description: '用户密码',
  })
  @Column()
  password: string;

  /** 用户昵称 */
  @ApiProperty({
    description: '用户昵称',
  })
  @Column()
  cname: string;

  /** 邮箱地址 */
  @ApiProperty({
    description: '邮箱地址',
  })
  @Column({ nullable: true })
  email: string;

  /** 手机号码 */
  @ApiProperty({
    description: '手机号码',
  })
  @Column({ nullable: true })
  phone: string;

  /** 退出登录时间 */
  @ApiProperty({
    description: '退出登录时间',
  })
  @Column({ default: null })
  out_login_date?: Date;

  /** 事件埋点 */
  @ApiHideProperty()
  @OneToMany(() => TrackEvent, (col) => col.user)
  trackEvents: TrackEvent[];
}
