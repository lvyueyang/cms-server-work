import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { META_PROPERTIES_TYPE } from '@/constants';

/** 元属性 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class TrackMetaProperties extends BaseEntity {
  @ApiProperty({
    description: '元属性 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '元属性名称',
  })
  @Index()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '元属性显示名',
  })
  @IsNotEmpty()
  @Column()
  cname: string;

  @ApiProperty({
    description: '元属性描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '元属性类型',
    enum: META_PROPERTIES_TYPE,
  })
  @IsEnum(META_PROPERTIES_TYPE)
  @Column()
  type: META_PROPERTIES_TYPE;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;
}
