import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/base.entity';
import { UserAdmin } from '../../modules/user_admin/user_admin.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** 广告 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class Banner extends BaseEntity {
  @ApiProperty({
    description: '广告 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '广告标题',
  })
  @IsNotEmpty()
  @Column()
  title: string;

  @ApiProperty({
    description: '广告封面图',
  })
  @Column()
  cover: string;

  @ApiProperty({
    description: '广告描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '广告详情',
  })
  @Column({ type: 'longtext' })
  content: string;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '广告创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: '广告创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.banner)
  @JoinColumn()
  author: UserAdmin;
}
