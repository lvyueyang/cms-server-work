import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Pagination, ResponseListResult, ResponseResult } from 'src/interface';
import { {{entityName}} } from './{{name}}.entity';

export class {{entityName}}Info extends {{entityName}} {}

export class {{entityName}}List {
  list: {{entityName}}Info[];
  total: number;
}

/** 新增 */
export class {{entityName}}CreateDto {
  @ApiProperty({
    description: '{{cname}}名称',
  })
  @IsNotEmpty()
  readonly title: {{entityName}}['title'];

  @ApiProperty({
    description: '{{cname}}描述',
  })
  readonly desc?: {{entityName}}['desc'];

  @ApiProperty({
    description: '{{cname}}封面',
  })
  @IsNotEmpty()
  readonly cover: {{entityName}}['cover'];

  @ApiProperty({
    description: '{{cname}}详情',
  })
  @IsNotEmpty()
  readonly content: {{entityName}}['content'];
}

/** 修改 */
export class {{entityName}}UpdateDto extends {{entityName}}CreateDto {}

/** Params */
export class {{entityName}}ByIdParamDto {
  @ApiProperty({
    description: '{{cname}} ID',
  })
  @IsNotEmpty()
  readonly id: {{entityName}}['id'];
}

/** 查询列表 */
export class {{entityName}}QueryListDto extends Pagination {
  @ApiProperty({ description: '{{cname}}名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class {{entityName}}ListResponseDto extends ResponseListResult {
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
