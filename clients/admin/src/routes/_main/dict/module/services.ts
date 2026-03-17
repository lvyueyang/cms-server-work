import {
  DictTypeCreateDto,
  DictTypeDetailResponseDto,
  DictTypeListAllResponseDto,
  DictTypeListResponseDto,
  DictTypeQueryListDto,
  DictTypeUpdateDto,
} from '@cms/api-interface';
import { Result } from '@/types';
import { AIP_FIX, request } from '@/request';

/** 列表 */
export const getListApi = (body: DictTypeQueryListDto) => {
  return request.post<DictTypeListResponseDto>(`${AIP_FIX}/dict_type/list`, body);
};

/** 全部列表 */
export const getListAllApi = () => {
  return request.post<DictTypeListAllResponseDto>(`${AIP_FIX}/dict/all`);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<DictTypeDetailResponseDto>(`${AIP_FIX}/dict_type/info`, { id });
};

/** 创建 */
export const createApi = (body: DictTypeCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/dict_type/create`, body);
};

/** 修改 */
export const updateApi = (body: DictTypeUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/dict_type/update`, body);
};

/** 删除 */
export const removeApi = (id: number | string) => {
  return request.post<Result<number>>(`${AIP_FIX}/dict_type/delete`, { id });
};
