import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '@/modules/user_admin/user_admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** 新闻中心 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: '标题',
  })
  title: string;

  @Column()
  @ApiProperty({
    description: '封面图',
  })
  cover: string;

  @ApiProperty({
    description: '描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '详情',
  })
  @Column({ type: 'longtext' })
  content: string;

  @ApiProperty({
    description: '发布时间',
  })
  @Column({ nullable: true })
  push_date?: Date;

  @ApiProperty({
    description: '推荐等级, 0 为不推荐, 后续可根据值大小进行排序',
  })
  @Column({ default: 0 })
  recommend: number;

  @ApiProperty({
    description: '是否可用',
  })
  @Column({ default: true })
  is_available: boolean;

  @ApiProperty({
    description: '描述',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: '创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.news)
  @JoinColumn()
  author: UserAdmin;
}
