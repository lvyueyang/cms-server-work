import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DictValue } from '../dict_value/dict_value.entity';

/** 字典类型 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class DictType extends BaseEntity {
  @ApiProperty({
    description: '字典类型 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '字典名称',
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '字典类型',
  })
  @IsNotEmpty()
  @Column()
  type: string;

  @ApiProperty({
    description: '字典描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '是否可用',
  })
  @Column({ default: false })
  is_available: boolean;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '字典值列表',
  })
  @OneToMany(() => DictValue, (col) => col.type)
  values: DictValue[];
}
