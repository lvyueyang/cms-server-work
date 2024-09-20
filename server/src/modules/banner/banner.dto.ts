import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { Banner } from './banner.entity';

export class BannerInfo extends Banner {}

export class BannerList {
  list: BannerInfo[];
  total: number;
}
/** 新增 */
export class BannerCreateDto extends PickType(Banner, ['title', 'desc', 'cover', 'content']) {}

/** 修改 */
export class BannerUpdateDto extends BannerCreateDto {}

/** Params */
export class BannerByIdParamDto {
  @ApiProperty({
    description: '广告 ID',
  })
  @IsNotEmpty()
  readonly id: Banner['id'];
}

/** 查询列表 */
export class BannerQueryListDto extends PaginationAndOrder<keyof Banner> {
  @ApiProperty({ description: '广告名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class BannerListResponseDto extends ResponseResult {
  data: BannerList;
}

/** 详情 Response */
export class BannerDetailResponseDto extends ResponseResult {
  data: BannerInfo;
}

/** ID Response */
export class BannerDetailIdResponseDto extends ResponseResult {
  data: number;
}
