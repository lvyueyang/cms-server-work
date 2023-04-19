import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ orderBy: { create_date: 'DESC' } })
export class User extends BaseEntity {
  /** C 端用户 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 用户名 */
  @Column()
  username: string;

  /** 用户密码 */
  @Column()
  password: string;

  /** 用户昵称 */
  @Column()
  cname: string;

  /** 邮箱地址 */
  @Column()
  email: string;

  /** 手机号码 */
  @Column()
  phone: string;
}
