import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity({ orderBy: { create_date: 'DESC' } })
export class BaseEntity {
  /** 创建时间 */
  @ApiProperty({
    description: '创建时间',
  })
  @CreateDateColumn()
  create_date: Date;

  /** 更新时间 */
  @ApiProperty({
    description: '更新时间',
  })
  @UpdateDateColumn()
  update_date: Date;
}
