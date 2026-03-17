import {
  SystemConfigCreateDto,
  SystemConfigDetailResponseDto,
  SystemConfigListResponseDto,
  SystemConfigQueryListDto,
  SystemConfigUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: SystemConfigQueryListDto) => {
  return request.post<SystemConfigListResponseDto>(`${AIP_FIX}/system_config/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<SystemConfigDetailResponseDto>(`${AIP_FIX}/system_config/info`, { id });
};

/** 创建 */
export const createApi = (body: SystemConfigCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/system_config/create`, body);
};

/** 修改 */
export const updateApi = (body: SystemConfigUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/system_config/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/system_config/delete`, { id });
};
