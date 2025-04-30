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
export const getListApi = (body: {{entityName}}QueryListDto) => {
  return request.post<{{entityName}}ListResponseDto>(`${AIP_FIX}/{{name}}/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<{{entityName}}DetailResponseDto>(`${AIP_FIX}/{{name}}/info`, { id });
};

/** 创建 */
export const createApi = (body: {{entityName}}CreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/{{name}}/create`, body);
};

/** 修改 */
export const updateApi = (body: {{entityName}}UpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/{{name}}/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/{{name}}/delete`, { id });
};
