import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { META_PROPERTIES_TYPE } from '../../constants';
import { TrackMetaEvent } from '../track_meta_event/track_meta_event.entity';
import { UserClient } from '../user_client/user_client.entity';

/** 事件记录 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class TrackEvent extends BaseEntity {
  @ApiProperty({
    description: '事件分析 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '事件名称',
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: '元事件ID',
  })
  @IsNotEmpty()
  @Column()
  metaEventId: number;

  @ApiProperty({
    description: '元事件信息',
  })
  @ManyToOne(() => TrackMetaEvent, (e) => e.trackEvents)
  metaEvent: TrackMetaEvent;

  @ApiProperty({
    description: '关联用户 ID',
  })
  @Column({ nullable: true })
  userId: string;

  @ApiProperty({
    description: '关联用户',
  })
  @ManyToOne(() => UserClient, (user) => user.trackEvents)
  @JoinColumn()
  user?: UserClient;

  @ApiProperty({
    description: '事件属性',
  })
  @OneToMany(() => TrackEventProperties, (p) => p.trackEvent)
  properties: TrackEventProperties[];
}

/** 事件记录属性 */
@Entity({ orderBy: { create_date: 'DESC' } })
export class TrackEventProperties extends BaseEntity {
  @ApiProperty({
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '属性名称',
  })
  @IsNotEmpty()
  @Column()
  key: string;

  @ApiProperty({
    description: '属性值',
  })
  @Column()
  value: string;

  @ApiProperty({
    description: '属性类型',
    enum: META_PROPERTIES_TYPE,
  })
  @Column()
  type: META_PROPERTIES_TYPE;

  @ApiProperty({
    description: '事件记录',
  })
  @ManyToOne(() => TrackEvent, (t) => t.id)
  trackEvent: TrackEvent;
}
