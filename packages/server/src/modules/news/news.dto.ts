import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseListResult, ResponseResult } from 'src/interface';
import { News } from './news.entity';

export class NewsInfo extends News {}

export class NewsList {
  list: NewsInfo[];
  total: number;
}

/** 新增 */
export class NewsCreateDto {
  @ApiProperty({
    description: '新闻中心名称',
  })
  @IsNotEmpty()
  readonly title: News['title'];

  @ApiProperty({
    description: '新闻中心描述',
  })
  readonly desc?: News['desc'];

  @ApiProperty({
    description: '新闻中心封面',
  })
  @IsNotEmpty()
  readonly cover: News['cover'];

  @ApiProperty({
    description: '新闻中心详情',
  })
  @IsNotEmpty()
  readonly content: News['content'];
}

/** 修改 */
export class NewsUpdateDto extends NewsCreateDto {}

/** Params */
export class NewsByIdParamDto {
  @ApiProperty({
    description: '新闻中心 ID',
  })
  @IsNotEmpty()
  readonly id: News['id'];
}

/** 查询列表 */
export class NewsQueryListDto extends Pagination {
  @ApiProperty({ description: '新闻中心名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class NewsListResponseDto extends ResponseListResult {
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
