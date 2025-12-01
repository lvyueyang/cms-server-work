import { AIP_FIX, request } from '@/request';
import { Result } from '@/types';

export interface ContentTranslationItem {
  id?: number;
  entity: string;
  entityId: number;
  field: string;
  lang: string;
  value: string;
}

export interface ContentTranslationQueryParams {
  entity?: string;
  entityId?: number;
  field?: string;
  lang?: string;
}

export interface ContentTranslationBatchBody {
  translations: ContentTranslationItem[];
}

export interface ContentTranslationListResponse {
  list: ContentTranslationItem[];
  total: number;
}

/** 查询翻译列表 */
export const getTranslationListApi = (params: ContentTranslationQueryParams) => {
  return request.post<Result<ContentTranslationListResponse>>(`${AIP_FIX}/i18n/list`, params);
};

/** 批量创建或更新翻译 */
export const batchUpsertTranslationsApi = (body: ContentTranslationBatchBody) => {
  return request.post<Result<number[]>>(`${AIP_FIX}/i18n/save/multi`, body);
};
