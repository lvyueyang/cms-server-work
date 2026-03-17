import {
  BusinessConfigCreateDto,
  BusinessConfigDetailResponseDto,
  BusinessConfigListResponseDto,
  BusinessConfigQueryListDto,
  BusinessConfigUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: BusinessConfigQueryListDto) => {
  return request.post<BusinessConfigListResponseDto>(`${AIP_FIX}/business_config/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<BusinessConfigDetailResponseDto>(`${AIP_FIX}/business_config/info`, { id });
};

/** 创建 */
export const createApi = (body: BusinessConfigCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/business_config/create`, body);
};

/** 修改 */
export const updateApi = (body: BusinessConfigUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/business_config/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/business_config/delete`, { id });
};

