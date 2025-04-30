import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseResult } from '@/interface';
import { News } from './news.entity';

export class NewsInfo extends News {}

export class NewsList {
  @ApiProperty({
    description: '列表',
  })
  list: NewsInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

/** 新增 */
export class NewsCreateDto extends PickType(News, [
  'title',
  'desc',
  'cover',
  'content',
  'recommend',
  'push_date',
  'is_available',
]) {}

/** 修改 */
export class NewsUpdateDto extends PartialType(NewsCreateDto) {
  @ApiProperty({
    description: '新闻 ID',
  })
  @IsNotEmpty()
  readonly id: News['id'];
}

/** Params */
export class NewsByIdParamDto {
  @ApiProperty({
    description: '新闻 ID',
  })
  @IsNotEmpty()
  readonly id: News['id'];
}

/** 查询列表 */
export class NewsQueryListDto extends Pagination {
  @ApiProperty({ description: '新闻名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class NewsListResponseDto extends ResponseResult {
  data: NewsList;
}

/** 详情 Response */
export class NewsDetailResponseDto extends ResponseResult {
  data: NewsInfo;
}

/** ID Response */
export class NewsDetailIdResponseDto extends ResponseResult {
  data: number;
}
