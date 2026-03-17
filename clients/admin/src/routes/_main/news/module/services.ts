import {
  NewsCreateDto,
  NewsDetailResponseDto,
  NewsListResponseDto,
  NewsQueryListDto,
  NewsUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';
import { ExportFileType } from '@cms/server/const';
import { downloadResponseFile } from '@/utils';

/** 列表 */
export const getListApi = (body: NewsQueryListDto) => {
  return request.post<NewsListResponseDto>(`${AIP_FIX}/news/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<NewsDetailResponseDto>(`${AIP_FIX}/news/info`, { id });
};

/** 创建 */
export const createApi = (body: NewsCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/news/create`, body);
};

/** 修改 */
export const updateApi = (body: NewsUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/news/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/news/delete`, { id });
};

/** 导出 */
export const exportApi = (export_type?: ExportFileType) => {
  return request
    .post<Result<null>>(`${AIP_FIX}/news/export`, { export_type }, { responseType: 'blob' })
    .then(downloadResponseFile);
};
