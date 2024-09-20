import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '@/modules/user_admin/user_admin.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** {{cname}} */
@Entity({ orderBy: { create_date: 'DESC' } })
export class {{entityName}} extends BaseEntity {
  @PrimaryGeneratedColumn()
  /**  ID */
  id: number;

  /** 标题 */
  @Column()
  title: string;

  /** 封面图 */
  @Column()
  cover: string;

  /** 描述 */
  @Column({ default: '' })
  desc?: string;

  /** 详情 */
  @Column({ type: 'longtext' })
  content: string;

  /** 是否已删除 */
  @Column({ default: false })
  is_delete: boolean;

  /** 创建者 ID */
  @Column({ nullable: true })
  authorId?: number;

  /** 创建者 */
  @ManyToOne(() => UserAdmin, (user) => user.{{name}})
  @JoinColumn()
  author: UserAdmin;
}
