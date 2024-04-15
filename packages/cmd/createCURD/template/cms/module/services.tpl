import {
  {{entityName}}CreateDto,
  {{entityName}}DetailResponseDto,
  {{entityName}}ListResponseDto,
  {{entityName}}QueryListDto,
  {{entityName}}UpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (params: {{entityName}}QueryListDto) => {
  return request.get<{{entityName}}ListResponseDto>(`${AIP_FIX}/{{name}}`, {
    params,
  });
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.get<{{entityName}}DetailResponseDto>(`${AIP_FIX}/{{name}}/${id}`);
};

/** 创建 */
export const createApi = (body: {{entityName}}CreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/{{name}}`, body);
};

/** 修改 */
export const updateApi = (id: number | string, body: {{entityName}}UpdateDto) => {
  return request.put<Result<string>>(`${AIP_FIX}/{{name}}/${id}`, body);
};

/** 删除 */
export const removeApi = (id: number | string) => {
  return request.delete<Result<number>>(`${AIP_FIX}/{{name}}/${id}`);
};
