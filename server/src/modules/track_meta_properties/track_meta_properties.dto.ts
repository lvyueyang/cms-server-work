import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { TrackMetaProperties } from './track_meta_properties.entity';

export class TrackMetaPropertiesInfo extends TrackMetaProperties {}

export class TrackMetaPropertiesList {
  list: TrackMetaPropertiesInfo[];
  total: number;
}
/** 新增 */
export class TrackMetaPropertiesCreateDto extends PickType(TrackMetaProperties, [
  'name',
  'cname',
  'desc',
  'type',
]) {}

/** 修改 */
export class TrackMetaPropertiesUpdateDto extends PickType(TrackMetaProperties, [
  'id',
  'cname',
  'desc',
]) {}

/** Params */
export class TrackMetaPropertiesByIdParamDto {
  @ApiProperty({
    description: '元属性 ID',
  })
  @IsNotEmpty()
  readonly id: TrackMetaProperties['id'];
}

/** 查询列表 */
export class TrackMetaPropertiesQueryListDto extends PaginationAndOrder<keyof TrackMetaProperties> {
  @ApiProperty({ description: '元属性名称-模糊搜索' })
  name?: string;
  @ApiProperty({ description: '元属性名称-模糊搜索' })
  cname?: string;
}

/** 列表 Response */
export class TrackMetaPropertiesListResponseDto extends ResponseResult {
  @ApiProperty({ description: '列表' })
  data: {
    list: TrackMetaPropertiesInfo[];
    total: number;
  };
}

/** 详情 Response */
export class TrackMetaPropertiesDetailResponseDto extends ResponseResult {
  data: TrackMetaPropertiesInfo;
}

/** ID Response */
export class TrackMetaPropertiesDetailIdResponseDto extends ResponseResult {
  data: number;
}
