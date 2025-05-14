import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { {{entityName}} } from './{{name}}.entity';

export class {{entityName}}Info extends {{entityName}} {}

export class {{entityName}}List {
  @ApiProperty({
    description: '列表',
  })
  list: {{entityName}}Info[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

/** 新增 */
export class {{entityName}}CreateDto extends PickType({{entityName}}, [
  'title',
  'desc',
  'cover',
  'content',
  'recommend',
  'is_available',
]) {}

/** 修改 */
export class {{entityName}}UpdateDto extends PartialType({{entityName}}CreateDto) {
  @ApiProperty({
    description: '{{cname}} ID',
  })
  @IsNotEmpty()
  readonly id: {{entityName}}['id'];
}

/** Params */
export class {{entityName}}ByIdParamDto {
  @ApiProperty({
    description: '{{cname}} ID',
  })
  @IsNotEmpty()
  readonly id: {{entityName}}['id'];
}

/** 查询列表 */
export class {{entityName}}QueryListDto extends PaginationAndOrder {
  @ApiProperty({ description: '{{cname}}名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class {{entityName}}ListResponseDto extends ResponseResult {
  data: {{entityName}}List;
}

/** 详情 Response */
export class {{entityName}}DetailResponseDto extends ResponseResult {
  data: {{entityName}}Info;
}

/** ID Response */
export class {{entityName}}DetailIdResponseDto extends ResponseResult {
  data: number;
}
