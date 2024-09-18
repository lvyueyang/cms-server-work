import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAdmin } from '../user_admin/user_admin.entity';

@Entity()
export class AdminRole extends BaseEntity {
  @ApiProperty({
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  /** 角色名称 */
  @ApiProperty({
    description: '角色名称',
  })
  @Column()
  name: string;

  /** 角色描述 */
  @ApiProperty({
    description: '角色描述',
  })
  @Column({ default: '' })
  desc?: string;

  /** 权限码 */
  @ApiProperty({
    description: '权限码',
  })
  @Column({ type: 'simple-array' })
  permission_code?: string[];

  /** 关联用户 */
  @ApiProperty({
    description: '关联用户',
  })
  @ApiHideProperty()
  @ManyToMany(() => UserAdmin, (user) => user.roles)
  users: UserAdmin[];
}
