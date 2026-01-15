import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

/** 开放文章 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class PublicArticle extends BaseEntity {
  @ApiProperty({
    description: '开放文章 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '开放文章编码',
  })
  @IsNotEmpty()
  @Index()
  @Column()
  code: string;

  @ApiProperty({
    description: '开放文章标题',
  })
  @IsNotEmpty()
  @Column()
  title: string;

  @ApiProperty({
    description: '开放文章封面图',
  })
  @Column()
  cover: string;

  @ApiProperty({
    description: '开放文章描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '内容类型',
  })
  @Column({ default: '' })
  content_type: string;

  @ApiProperty({
    description: '开放文章详情',
  })
  @Column({ type: 'longtext' })
  content: string;

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
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;
}
