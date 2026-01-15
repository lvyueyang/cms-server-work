import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { PublicArticle } from './public_article.entity';

export class PublicArticleInfo extends PublicArticle {}

export class PublicArticleList {
  @ApiProperty({
    description: '列表',
  })
  list: PublicArticleInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

/** 新增 */
export class PublicArticleCreateDto extends PickType(PublicArticle, [
  'title',
  'code',
  'desc',
  'cover',
  'content_type',
  'content',
  'recommend',
  'is_available',
]) {}

/** 修改 */
export class PublicArticleUpdateDto extends PartialType(PublicArticleCreateDto) {
  @ApiProperty({
    description: '开放文章 ID',
  })
  @IsNotEmpty()
  readonly id: PublicArticle['id'];
}

/** Params */
export class PublicArticleByIdParamDto {
  @ApiProperty({
    description: '开放文章 ID',
  })
  @IsNotEmpty()
  readonly id: PublicArticle['id'];
}

/** 查询列表 */
export class PublicArticleQueryListDto extends PaginationAndOrder<keyof PublicArticle> {
  @ApiProperty({ description: '开放文章名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class PublicArticleListResponseDto extends ResponseResult {
  data: PublicArticleList;
}

/** 详情 Response */
export class PublicArticleDetailResponseDto extends ResponseResult {
  data: PublicArticleInfo;
}

/** ID Response */
export class PublicArticleDetailIdResponseDto extends ResponseResult {
  data: number;
}
