import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseResult } from '@/interface';
import { DictValue } from './dict_value.entity';
import { DictType } from '../dict_type/dict_type.entity';

const CreateDto = PickType(DictValue, [
  'label',
  'value',
  'desc',
  'recommend',
  'typeId',
  'is_available',
  'attr',
]);

export class DictValueInfo extends DictValue {}

export class DictValueList {
  list: DictValueInfo[];
  total: number;
}
/** 新增 */
export class DictValueCreateDto extends CreateDto {}

/** 修改 */
export class DictValueUpdateDto extends PartialType(OmitType(CreateDto, ['typeId'])) {
  @ApiProperty({
    description: '字典值 ID',
  })
  @IsNotEmpty()
  readonly id: DictValue['id'];
}

/** Params */
export class DictValueByIdParamDto {
  @ApiProperty({
    description: '字典值 ID',
  })
  @IsNotEmpty()
  readonly id: DictValue['id'];
}

/** 查询列表 */
export class DictValueQueryListDto {
  @ApiProperty({ description: '字典值名称-模糊搜索' })
  keyword?: string;

  @ApiProperty({ description: '字典类型ID' })
  typeId: number;
}

/** 列表 Response */
export class DictValueListResponseDto extends ResponseResult {
  data: DictValueList;
}

/** 根据Type查询列表 */
export class DictValueQueryListByTypeDto {
  @ApiProperty({ description: '字典类型' })
  type: string;
}

/** 根据Type查询列表 Response */
export class DictValueListByTypeResponseDto extends ResponseResult {
  data: {
    type: DictType;
    list: DictValueInfo[];
  };
}

/** 详情 Response */
export class DictValueDetailResponseDto extends ResponseResult {
  data: DictValueInfo;
}

/** ID Response */
export class DictValueDetailIdResponseDto extends ResponseResult {
  data: number;
}
