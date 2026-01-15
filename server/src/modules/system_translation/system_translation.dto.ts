import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ContentLang } from '@/constants';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { SystemTranslation } from './system_translation.entity';

export class SystemTranslationInfo extends SystemTranslation {}

export class SystemTranslationList {
  @ApiProperty({
    description: '列表',
  })
  list: SystemTranslationInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

/** 新增 */
export class SystemTranslationCreateDto extends PickType(SystemTranslation, [
  'key',
  'desc',
  'value',
  'value_type',
  'lang',
]) {}
export class SystemTranslationMultiCreateDto {
  list: SystemTranslationCreateDto[];
}

/** 修改 */
export class SystemTranslationUpdateDto extends PartialType(SystemTranslationCreateDto) {
  @ApiProperty({
    description: '国际化 ID',
  })
  @IsNotEmpty()
  readonly id: SystemTranslation['id'];
}

/** Params */
export class SystemTranslationByIdParamDto {
  @ApiProperty({
    description: '国际化 ID',
  })
  @IsNotEmpty()
  readonly id: SystemTranslation['id'];
}

/** 查询列表 */
export class SystemTranslationQueryListDto extends PaginationAndOrder<keyof SystemTranslation> {
  @ApiProperty({ description: 'Key' })
  key?: string;

  @ApiProperty({ description: '语言' })
  lang?: ContentLang;

  @ApiProperty({ description: '值' })
  value?: string;
}

/** 列表 Response */
export class SystemTranslationListResponseDto extends ResponseResult {
  data: SystemTranslationList;
}

/** 详情 Response */
export class SystemTranslationDetailResponseDto extends ResponseResult {
  data: SystemTranslationInfo;
}

/** ID Response */
export class SystemTranslationDetailIdResponseDto extends ResponseResult {
  data: number;
}
