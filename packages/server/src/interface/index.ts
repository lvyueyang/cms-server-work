import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

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

/** 排序 */
export class Order<T extends string> {
  /** key */
  @ApiPropertyOptional({
    default: 'create_at',
    description: '被排序的字段',
  })
  readonly order_key?: T;

  /** 排序方式 */
  @ApiPropertyOptional({
    default: 10,
    description: '排序方式 DESC 降序 ASC 倒序',
  })
  readonly order_type?: 'DESC' | 'ASC';
}

export class PaginationAndOrder<T extends string> extends Pagination {
  /** key */
  @ApiPropertyOptional({
    default: 'create_at',
    description: '被排序的字段',
  })
  readonly order_key?: T;

  /** 排序方式 */
  @ApiPropertyOptional({
    default: 10,
    description: '排序方式 DESC 降序 ASC 倒序',
  })
  @IsOptional()
  @IsEnum(['DESC', 'ASC'])
  readonly order_type?: 'DESC' | 'ASC';
}

/** 请求结果响应数据 */
export class ResponseResult<T = any> {
  @ApiProperty({ description: '状态码', default: 200 })
  readonly code: number;
  @ApiProperty({ description: '状态描述', default: '请求成功' })
  readonly message: string;
  data: T;
}
