import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { News } from '../news/news.entity';
import { AdminRole } from '../user_admin_role/user_admin_role.entity';
import { WebhookTrans } from '../webhook_trans/webhook_trans.entity';
import { FileManage } from '../file_manage/file_manage.entity';

/** 管理员账户 */
@Entity({ orderBy: { is_root: 'DESC', create_date: 'DESC' } })
export class UserAdmin extends BaseEntity {
  /** 管理账户 ID */
  @ApiProperty({
    description: '管理账户 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  /** 用户名 */
  @ApiProperty({
    description: '用户名',
  })
  @Column({
    unique: true,
  })
  username: string;

  /** 用户密码 */
  @ApiProperty({
    description: '用户密码',
  })
  @Column({ select: false })
  password: string;

  /** 用户昵称 */
  @ApiProperty({
    description: '用户昵称',
  })
  @Column()
  cname: string;

  /** 用户邮箱 */
  @ApiProperty({
    description: '用户邮箱',
  })
  @Column({
    unique: true,
  })
  email: string;

  /** 是否为根用户 */
  @ApiProperty({
    description: '是否为根用户',
  })
  @Column({ default: false })
  is_root?: boolean;

  /** 退出登录时间 */
  @ApiProperty({
    description: '退出登录时间',
  })
  @Column({ default: null })
  out_login_date?: Date;

  /** 关联角色 */
  @ApiProperty({
    description: '关联角色',
  })
  @ManyToMany(() => AdminRole, (role) => role.users)
  @JoinTable()
  roles: AdminRole[];

  /** Webhook中转 */
  @ApiHideProperty()
  @OneToMany(() => WebhookTrans, (col) => col.author)
  webhook_trans: WebhookTrans[];

  /** 文件管理 */
  @ApiHideProperty()
  @OneToMany(() => FileManage, (col) => col.author)
  file_manage: FileManage[];

  /** 新闻 */
  @ApiProperty({
    description: '新闻',
  })
  @ApiHideProperty()
  @OneToMany(() => News, (col) => col.author)
  news: News[];
}
