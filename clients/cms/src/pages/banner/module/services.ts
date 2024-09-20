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
export const getListApi = (params: BannerQueryListDto) => {
  return request.get<BannerListResponseDto>(`${AIP_FIX}/banner`, {
    params,
  });
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.get<BannerDetailResponseDto>(`${AIP_FIX}/banner/${id}`);
};

/** 创建 */
export const createApi = (body: BannerCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/banner`, body);
};

/** 修改 */
export const updateApi = (id: number | string, body: BannerUpdateDto) => {
  return request.put<Result<string>>(`${AIP_FIX}/banner/${id}`, body);
};

/** 删除 */
export const removeApi = (id: number | string) => {
  return request.delete<Result<number>>(`${AIP_FIX}/banner/${id}`);
};
