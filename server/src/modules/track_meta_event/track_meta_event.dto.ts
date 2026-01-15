import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { TrackMetaEvent } from './track_meta_event.entity';

export class TrackMetaEventInfo extends TrackMetaEvent {}

export class TrackMetaEventList {
  list: TrackMetaEventInfo[];
  total: number;
}
/** 新增 */
export class TrackMetaEventCreateDto extends PickType(TrackMetaEvent, ['name', 'cname', 'desc']) {
  @ApiProperty({
    description: '事件属性名称列表',
  })
  properties: string[];
}

/** 修改 */
export class TrackMetaEventUpdateDto extends PickType(TrackMetaEventCreateDto, [
  'cname',
  'desc',
  'properties',
]) {
  @ApiProperty({
    description: '事件属性ID',
  })
  id: number;
}

/** Params */
export class TrackMetaEventByIdParamDto {
  @ApiProperty({
    description: '元事件 ID',
  })
  @IsNotEmpty()
  readonly id: TrackMetaEvent['id'];
}

/** 查询列表 */
export class TrackMetaEventQueryListDto extends PaginationAndOrder<keyof TrackMetaEvent> {
  @ApiProperty({ description: '元事件名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class TrackMetaEventListResponseDto extends ResponseResult {
  @ApiProperty({ description: '查询结果' })
  data: TrackMetaEventList;
}

/** 详情 Response */
export class TrackMetaEventDetailResponseDto extends ResponseResult {
  data: TrackMetaEventInfo;
}

/** ID Response */
export class TrackMetaEventDetailIdResponseDto extends ResponseResult {
  data: number;
}
