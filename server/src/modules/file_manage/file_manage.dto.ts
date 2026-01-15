import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { FileManage } from './file_manage.entity';

export class FileManageInfo extends FileManage {}

export class FileManageList {
  @ApiProperty({
    description: '列表',
  })
  list: FileManageInfo[];
  @ApiProperty({
    description: '总数',
  })
  total: number;
}

// 修改文件信息
export class FileManageUpdateDto extends PickType(FileManage, [
  'id',
  'desc',
  'login_download_auth',
]) {}

// 文件重命名
export class FileManageRenameDto extends PickType(FileManage, ['id', 'name']) {}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ description: '文件标签' })
  tags: string[];
}

/** 添加/删除标签 */
export class FileManageAddOrRemoveTagsDto {
  @ApiProperty({
    description: '文件 ID',
  })
  @IsNotEmpty()
  readonly id: FileManage['id'];

  @ApiProperty({
    description: '文件标签',
  })
  @IsNotEmpty()
  readonly tags: string[];
}

/** Params */
export class FileManageByIdParamDto {
  @ApiProperty({
    description: '文件 ID',
  })
  @IsNotEmpty()
  readonly id: FileManage['id'];
}

/** 查询列表 */
export class FileManageQueryListDto extends PaginationAndOrder<keyof FileManage> {
  @ApiProperty({ description: '文件管理名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class FileManageListResponseDto extends ResponseResult {
  data: FileManageList;
}

/** 详情 Response */
export class FileManageDetailResponseDto extends ResponseResult {
  data: FileManageInfo;
}

/** ID Response */
export class FileManageDetailIdResponseDto extends ResponseResult {
  data: number;
}
