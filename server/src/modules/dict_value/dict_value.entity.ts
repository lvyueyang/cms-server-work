import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { DictType } from '../dict_type/dict_type.entity';

/** 字典值 */
@Entity({ orderBy: { create_date: 'ASC' } })
export class DictValue extends BaseEntity {
  @ApiProperty({
    description: '字典值 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '字典值名称',
  })
  @IsNotEmpty()
  @Column()
  label: string;

  @ApiProperty({
    description: '字典值',
  })
  @IsNotEmpty()
  @Column()
  value: string;

  @ApiProperty({
    description: '字典值附加属性',
  })
  @Column({ length: 1000, nullable: true })
  attr?: string;

  @ApiProperty({
    description: '附加属性类型：例如 code rich lowcode',
  })
  @Column({ default: '' })
  attr_type?: string;

  @ApiProperty({
    description: '类型ID',
  })
  @IsNotEmpty()
  @Column()
  typeId: number;

  @ManyToOne(() => DictType, (col) => col.values)
  type: DictType;

  @ApiProperty({
    description: '排序',
  })
  @Min(0)
  @Column({ default: 0 })
  recommend: number;

  @ApiProperty({
    description: '字典值描述',
  })
  @Column({ default: '' })
  desc?: string;

  /** 是否可用 */
  @ApiProperty({
    description: '是否可用',
  })
  @Column({ default: false })
  is_available: boolean;
}
