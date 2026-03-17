import {
  DictValueCreateDto,
  DictValueDetailResponseDto,
  DictValueListResponseDto,
  DictValueQueryListDto,
  DictValueUpdateDto,
} from '@cms/api-interface';
import { AIP_FIX, request } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (params: DictValueQueryListDto) => {
  return request.post<DictValueListResponseDto>(`${AIP_FIX}/dict_value/list`, params);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<DictValueDetailResponseDto>(`${AIP_FIX}/dict_value/info`, { id });
};

/** 创建 */
export const createApi = (body: DictValueCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/dict_value/create`, body);
};

/** 修改 */
export const updateApi = (body: DictValueUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/dict_value/update`, body);
};

/** 删除 */
export const removeApi = (ids: number[]) => {
  return request.post<Result<number>>(`${AIP_FIX}/dict_value/delete`, {
    id: ids,
  });
};
