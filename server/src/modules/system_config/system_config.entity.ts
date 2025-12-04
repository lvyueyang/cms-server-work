import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** 系统配置 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class SystemConfig extends BaseEntity {
  @ApiProperty({
    description: '系统配置 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '编码',
  })
  @Index()
  @IsNotEmpty()
  @Column()
  code: string;

  @ApiProperty({
    description: '系统配置标题',
  })
  @IsNotEmpty()
  @Column()
  title: string;

  @ApiProperty({
    description: '系统配置内容类型',
  })
  @Column({ default: '' })
  content_type: string;

  @ApiProperty({
    description: '系统配置详情',
  })
  @Column({ type: 'longtext', nullable: true })
  content: string;

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
