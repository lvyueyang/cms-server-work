import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ContentLang } from '@/constants';

@Entity({ name: 'content_translation' })
@Unique(['entity', 'entityId', 'field', 'lang'])
export class ContentTranslation {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '实体名，如 news、product' })
  @Index()
  @Column({ length: 64 })
  @IsNotEmpty()
  entity: string;

  @ApiProperty({ description: '实体记录 ID' })
  @Index()
  @Column()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: '字段名，如 title、desc、content' })
  @Index()
  @Column({ length: 64 })
  @IsNotEmpty()
  field: string;

  @ApiProperty({ description: '语言代码', enum: ContentLang })
  @Index()
  @Column({ type: 'varchar', length: 16 })
  @IsNotEmpty()
  lang: ContentLang;

  @ApiProperty({ description: '翻译值' })
  @Column({ type: 'longtext' })
  @IsNotEmpty()
  value: string;
}
