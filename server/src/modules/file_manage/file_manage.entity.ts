import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '@/modules/user_admin/user_admin.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** 文件管理 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class FileManage extends BaseEntity {
  @ApiProperty({
    description: '文件 ID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '文件名称',
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '文件大小',
  })
  @IsNotEmpty()
  @Column()
  size: number;

  @ApiProperty({
    description: '文件扩展名',
  })
  @Column()
  ext: string;

  @ApiProperty({
    description: '文件类型',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: '文件哈希值',
  })
  @IsNotEmpty()
  @Column()
  hash: string;

  @ApiProperty({
    description: '文件路径',
  })
  @IsNotEmpty()
  @Column()
  local_path: string;

  @ApiProperty({
    description: '文件标签',
  })
  @Column({ type: 'simple-array' })
  tags: string[];

  @ApiProperty({
    description: '文件备注',
  })
  @Column({ default: '' })
  desc: string;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '文件管理创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: '文件创建者',
  })
  @ManyToOne(() => UserAdmin, (user) => user.file_manage)
  @JoinColumn()
  author: UserAdmin;
}
