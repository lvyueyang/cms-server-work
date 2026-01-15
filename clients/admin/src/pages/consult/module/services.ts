import {
  ConsultCreateDto,
  ConsultDetailResponseDto,
  ConsultListResponseDto,
  ConsultQueryListDto,
  ConsultUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: ConsultQueryListDto) => {
  return request.post<ConsultListResponseDto>(`${AIP_FIX}/consult/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<ConsultDetailResponseDto>(`${AIP_FIX}/consult/info`, { id });
};

/** 创建 */
export const createApi = (body: ConsultCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/consult/create`, body);
};

/** 修改 */
export const updateApi = (body: ConsultUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/consult/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/consult/delete`, { id });
};
