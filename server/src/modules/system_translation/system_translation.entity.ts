import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ContentLang } from '@/constants';
import { BaseEntity } from '../../common/base.entity';

/** 国际化 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class SystemTranslation extends BaseEntity {
  @ApiProperty({
    description: '国际化 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '国际化Key',
  })
  @IsNotEmpty()
  @Index()
  @Column({ length: 500 })
  key: string;

  @ApiProperty({
    description: '国际化描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '国际化Value类型',
  })
  @Column({ nullable: true })
  value_type: string;

  @ApiProperty({
    description: '国际化Value',
  })
  @Column({ type: 'longtext' })
  value: string;

  @ApiProperty({ description: '语言', enum: ContentLang })
  @Index()
  @Column({ type: 'varchar', length: 16 })
  @IsNotEmpty()
  lang: ContentLang;
}
