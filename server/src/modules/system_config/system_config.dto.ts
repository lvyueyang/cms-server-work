import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { SystemConfig } from './system_config.entity';

export class SystemConfigInfo extends SystemConfig {}

export class SystemConfigList {
  @ApiProperty({
    description: '列表',
  })
  list: SystemConfigInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

/** 新增 */
export class SystemConfigCreateDto extends PickType(SystemConfig, [
  'title',
  'code',
  'content_type',
  'content',
  'is_available',
]) {}

/** 修改 */
export class SystemConfigUpdateDto extends PartialType(SystemConfigCreateDto) {
  @ApiProperty({
    description: '系统配置 ID',
  })
  @IsNotEmpty()
  readonly id: SystemConfig['id'];
}

/** Params */
export class SystemConfigByIdParamDto {
  @ApiProperty({
    description: '系统配置 ID',
  })
  @IsNotEmpty()
  readonly id: SystemConfig['id'];
}

/** 查询列表 */
export class SystemConfigQueryListDto extends PaginationAndOrder<keyof SystemConfig> {
  @ApiProperty({ description: '系统配置名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class SystemConfigListResponseDto extends ResponseResult {
  data: SystemConfigList;
}

/** 详情 Response */
export class SystemConfigDetailResponseDto extends ResponseResult {
  data: SystemConfigInfo;
}

/** ID Response */
export class SystemConfigDetailIdResponseDto extends ResponseResult {
  data: number;
}
