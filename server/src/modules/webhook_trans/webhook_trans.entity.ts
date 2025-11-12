import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '@/modules/user_admin/user_admin.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** Webhook中转 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class WebhookTrans extends BaseEntity {
  @ApiProperty({
    description: 'Webhook中转 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '唯一标识',
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Webhook中转描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '前置钩子函数',
  })
  @Column({ type: 'longtext' })
  before_hook_func: string;

  @ApiProperty({
    description: '数据转换函数',
  })
  @Column({ type: 'longtext' })
  data_trans_func: string;

  @ApiProperty({
    description: '回调函数',
  })
  @Column({ type: 'longtext' })
  callback_func: string;

  @ApiProperty({
    description: '请求地址',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: '请求方法',
  })
  @Column()
  method: string;

  /** 是否可用 */
  @ApiProperty({
    description: '是否可用',
  })
  @Column({ default: false })
  is_available: boolean;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: 'Webhook中转创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: 'Webhook中转创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.webhook_trans)
  @JoinColumn()
  author: UserAdmin;
}
