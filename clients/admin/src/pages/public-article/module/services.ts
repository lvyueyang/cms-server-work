import {
  PublicArticleCreateDto,
  PublicArticleDetailResponseDto,
  PublicArticleListResponseDto,
  PublicArticleQueryListDto,
  PublicArticleUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: PublicArticleQueryListDto) => {
  return request.post<PublicArticleListResponseDto>(`${AIP_FIX}/public_article/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<PublicArticleDetailResponseDto>(`${AIP_FIX}/public_article/info`, { id });
};

/** 创建 */
export const createApi = (body: PublicArticleCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/public_article/create`, body);
};

/** 修改 */
export const updateApi = (body: PublicArticleUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/public_article/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/public_article/delete`, { id });
};
