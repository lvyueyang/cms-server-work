import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/base.entity';
import { UserAdmin } from '../../modules/user_admin/user_admin.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** {{cname}} */
@Entity({ orderBy: { create_date: 'DESC' } })
export class {{entityName}} extends BaseEntity {
  @ApiProperty({
    description: '{{cname}} ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '{{cname}}标题',
  })
  @IsNotEmpty()
  @Column()
  title: string;

  @ApiProperty({
    description: '{{cname}}封面图',
  })
  @Column()
  cover: string;

  @ApiProperty({
    description: '{{cname}}描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '{{cname}}详情',
  })
  @Column({ type: 'longtext' })
  content: string;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '{{cname}}创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: '{{cname}}创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.{{name}})
  @JoinColumn()
  author: UserAdmin;
}
