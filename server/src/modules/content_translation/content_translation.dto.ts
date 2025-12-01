import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { ContentTranslation } from './content_translation.entity';
import { ContentLang } from '@/constants';

export class ContentTranslationInfo extends ContentTranslation {}
export class ContentTranslationList {
  @ApiProperty({
    description: '列表',
  })
  list: ContentTranslationInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

// 新增/更新
export class ContentTranslationUpsertBodyDto extends PickType(ContentTranslation, [
  'entity',
  'entityId',
  'field',
  'lang',
  'value',
]) {}

/** 列表 Response */
export class ContentTranslationListResponseDto extends ResponseResult {
  data: ContentTranslationList;
}

/** 查询列表 */
export class ContentTranslationQueryListDto extends PaginationAndOrder<keyof ContentTranslation> {
  @ApiProperty({ description: '实体名，如 news、product' })
  entity: string;

  @ApiProperty({ description: '字段名，如 title、desc、content' })
  field: string;

  @ApiProperty({ description: '语言代码', enum: ContentLang })
  lang: ContentLang;
}

export class ContentTranslationUpsertResponseDto extends ResponseResult<number> {
  @ApiProperty({ description: '翻译记录 ID' })
  data: number;
}

export class ContentTranslationQueryParamsDto extends PartialType(
  PickType(ContentTranslation, ['entityId', 'field', 'lang']),
) {
  @ApiProperty({ description: '实体名，如 news、product' })
  entity: string;
}

export class ContentTranslationBatchItemDto extends PickType(ContentTranslation, [
  'entity',
  'entityId',
  'field',
  'lang',
  'value',
]) {}

export class ContentTranslationMulitUpsertBodyDto {
  @ApiProperty({
    description: '批量翻译数据',
    type: [ContentTranslationUpsertBodyDto],
  })
  translations: ContentTranslationUpsertBodyDto[];
}

export class ContentTranslationMulitUpsertResponseDto extends ResponseResult<number[]> {
  @ApiProperty({ description: '翻译记录 ID 列表' })
  data: number[];
}
