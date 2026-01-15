import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { UserAdmin } from '../user_admin/user_admin.entity';

@Entity()
export class AdminRole extends BaseEntity {
  @ApiProperty({
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '角色名称',
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '角色描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '权限码',
  })
  @Column({ type: 'simple-array' })
  permission_code?: string[];

  @ApiProperty({
    description: '关联用户',
  })
  @ApiHideProperty()
  @ManyToMany(() => UserAdmin, (user) => user.roles)
  users: UserAdmin[];
}
