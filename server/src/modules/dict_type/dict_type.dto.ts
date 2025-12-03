import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { DictType } from './dict_type.entity';

export class DictTypeInfo extends DictType {}
export class DictTypeList {
  list: DictTypeInfo[];
  total: number;
}

/** 新增 */
export class DictTypeCreateDto extends PickType(DictType, [
  'name',
  'type',
  'desc',
  'attr_type',
  'is_available',
]) {}

/** 修改 */
export class DictTypeUpdateDto extends PartialType(DictTypeCreateDto) {
  @ApiProperty({
    description: '字典类型 ID',
  })
  @IsNotEmpty()
  readonly id: DictType['id'];
}

/** Params */
export class DictTypeByIdParamDto {
  @ApiProperty({
    description: '字典类型 ID',
  })
  @IsNotEmpty()
  readonly id: DictType['id'];
}

/** 查询列表 */
export class DictTypeQueryListDto extends PaginationAndOrder<keyof DictType> {
  @ApiProperty({ description: '字典类型名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class DictTypeListResponseDto extends ResponseResult {
  data: DictTypeList;
}

/** 全部列表 Response */
export class DictTypeListAllResponseDto extends ResponseResult {
  data: DictTypeInfo[];
}

/** 详情 Response */
export class DictTypeDetailResponseDto extends ResponseResult {
  data: DictTypeInfo;
}

/** ID Response */
export class DictTypeDetailIdResponseDto extends ResponseResult {
  data: number;
}
