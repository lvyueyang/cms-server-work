import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '@/modules/user_admin/user_admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** 新闻中心 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  /**  ID */
  @ApiProperty({
    description: 'ID',
  })
  id: number;

  /** 标题 */
  @Column()
  @ApiProperty({
    description: '标题',
  })
  title: string;

  /** 封面图 */
  @Column()
  @ApiProperty({
    description: '封面图',
  })
  cover: string;

  /** 描述 */
  @ApiProperty({
    description: '描述',
  })
  @Column({ default: '' })
  desc?: string;

  /** 详情 */
  @ApiProperty({
    description: '详情',
  })
  @Column({ type: 'longtext' })
  content: string;

  /** 发布时间 */
  @ApiProperty({
    description: '发布时间',
  })
  @Column({ nullable: true })
  push_date?: Date;

  /** 推荐等级 */
  @ApiProperty({
    description: '推荐等级, 0 为不推荐, 后续可根据值大小进行排序',
  })
  @Column({ default: 0 })
  recommend: number;

  /** 是否已删除 */
  @ApiProperty({
    description: '描述',
  })
  @Column({ default: false })
  is_delete: boolean;

  /** 创建者 ID */
  @ApiProperty({
    description: '创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  /** 创建者 */
  @ApiProperty({
    description: '创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.news)
  @JoinColumn()
  author: UserAdmin;
}
