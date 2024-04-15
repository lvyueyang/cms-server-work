import {
  NewsCreateDto,
  NewsDetailResponseDto,
  NewsListResponseDto,
  NewsQueryListDto,
  NewsUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (params: NewsQueryListDto) => {
  return request.get<NewsListResponseDto>(`${AIP_FIX}/news`, {
    params,
  });
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.get<NewsDetailResponseDto>(`${AIP_FIX}/news/${id}`);
};

/** 创建 */
export const createApi = (body: NewsCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/news`, body);
};

/** 修改 */
export const updateApi = (id: number | string, body: NewsUpdateDto) => {
  return request.put<Result<string>>(`${AIP_FIX}/news/${id}`, body);
};

/** 删除 */
export const removeApi = (id: number | string) => {
  return request.delete<Result<number>>(`${AIP_FIX}/news/${id}`);
};
