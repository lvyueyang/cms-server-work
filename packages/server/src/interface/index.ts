import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/** 分页 */
export class Pagination {
  /** 当前页 */
  @ApiPropertyOptional({
    default: 1,
    description: '分页查询-当前页',
  })
  @IsNumber()
  readonly current: number;

  /** 每页数量 */
  @ApiPropertyOptional({
    default: 10,
    description: '分页查询-每页数量',
  })
  @IsNumber()
  readonly page_size: number;
}

/** 请求结果响应数据 */
export class ResponseResult<T = any> {
  @ApiProperty({ description: '状态码', default: 200 })
  readonly code: number;
  @ApiProperty({ description: '状态描述', default: '请求成功' })
  readonly message: string;
  data: T;
}

/** 请求结果列表响应数据 */
export class ResponseListResult<T = any> extends ResponseResult<any> {
  data: {
    total: number;
    list: T[];
  };
}
