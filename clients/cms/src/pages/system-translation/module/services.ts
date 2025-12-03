import {
  SystemTranslationCreateDto,
  SystemTranslationDetailResponseDto,
  SystemTranslationListResponseDto,
  SystemTranslationMultiCreateDto,
  SystemTranslationQueryListDto,
  SystemTranslationUpdateDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: SystemTranslationQueryListDto) => {
  return request.post<SystemTranslationListResponseDto>(`${AIP_FIX}/system_translation/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<SystemTranslationDetailResponseDto>(`${AIP_FIX}/system_translation/info`, {
    id,
  });
};

/** 创建 */
export const createApi = (body: SystemTranslationCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/system_translation/create`, body);
};
/** 批量创建 */
export const createMultiApi = (body: SystemTranslationMultiCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/system_translation/create/multi`, body);
};

/** 修改 */
export const updateApi = (body: SystemTranslationUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/system_translation/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/system_translation/delete`, { id });
};
