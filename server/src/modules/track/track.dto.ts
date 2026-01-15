import { ApiProperty } from '@nestjs/swagger';
import { Pagination, ResponseResult } from '@/interface';
import { TrackEvent } from './track.entity';

/** ID Response */
export class TrackDetailIdResponseDto extends ResponseResult {
  data: number;
}

export class GetTrackEventListResponseDto extends ResponseResult {
  @ApiProperty({ description: '结果' })
  data: {
    list: TrackEvent[];
    total: number;
  };
}

export class GetTrackEventListQueryDto extends Pagination {
  @ApiProperty({ description: '按名称搜索' })
  name?: string;
  @ApiProperty({ description: '开始时间' })
  start_date?: string;
  @ApiProperty({ description: '结束时间' })
  end_date?: string;
  @ApiProperty({ description: '属性 Key' })
  properties_key?: string;
  @ApiProperty({ description: '属性 value 模糊匹配' })
  properties_value?: string;
}

export class GetTrackEventChartQueryDto {
  @ApiProperty({ description: '事件名称' })
  name: string;
  @ApiProperty({ description: '开始时间' })
  start_date: string;
  @ApiProperty({ description: '结束时间' })
  end_date: string;
  @ApiProperty({ description: '属性 Key' })
  properties_key?: string;
  @ApiProperty({ description: '属性 value 模糊匹配' })
  properties_value?: string;
}

export class GetTrackEventChartResponseDto extends ResponseResult {
  @ApiProperty({ description: '结果' })
  data: ChartItem[];
}

export class ChartItem {
  @ApiProperty({ description: '日期' })
  date: string;

  @ApiProperty({ description: '数量' })
  count: number;
}
