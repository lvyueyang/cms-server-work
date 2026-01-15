import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

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
    description: '广告位置',
  })
  @Column()
  position: string;

  @ApiProperty({
    description: '广告链接',
  })
  @Column({ nullable: true })
  url: string;

  @ApiProperty({
    description: '广告描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '广告详情',
  })
  @Column({ type: 'longtext', nullable: true })
  content?: string;

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

  @ApiProperty({
    description: '广告创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;
}
