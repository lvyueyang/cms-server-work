import {
  BannerCreateDto,
  BannerDetailResponseDto,
  BannerListResponseDto,
  BannerQueryListDto,
  BannerUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: BannerQueryListDto) => {
  return request.post<BannerListResponseDto>(`${AIP_FIX}/banner/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<BannerDetailResponseDto>(`${AIP_FIX}/banner/info`, { id });
};

/** 创建 */
export const createApi = (body: BannerCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/banner/create`, body);
};

/** 修改 */
export const updateApi = (body: BannerUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/banner/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/banner/delete`, { id });
};
