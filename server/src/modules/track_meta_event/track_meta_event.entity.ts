import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { TrackEvent } from '../track/track.entity';
import { TrackMetaProperties } from '../track_meta_properties/track_meta_properties.entity';

/** 元事件 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class TrackMetaEvent extends BaseEntity {
  @ApiProperty({
    description: '元事件 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '元事件名称',
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '元事件显示名称',
  })
  @Column()
  cname: string;

  @ApiProperty({
    description: '元事件描述',
  })
  @Column({ default: '' })
  desc?: string;

  @ApiProperty({
    description: '是否已删除',
  })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({
    description: '元事件创建者 ID',
  })
  @Column({ nullable: true })
  authorId?: number;

  @ApiProperty({
    description: '事件属性',
  })
  @ManyToMany(() => TrackMetaProperties)
  @JoinTable()
  properties?: TrackMetaProperties[];

  @OneToMany(() => TrackEvent, (t) => t.metaEvent)
  trackEvents: TrackEvent[];
}
