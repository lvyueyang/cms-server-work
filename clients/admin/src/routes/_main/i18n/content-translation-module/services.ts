import { AIP_FIX, request } from '@/request';
import { Result } from '@/types';
import { downloadResponseFile } from '@/utils';
import { ContentTranslationQueryListDto, ContentTranslationUpdateDto } from '@cms/api-interface';
import { ExportFileType } from '@cms/server/const';

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
export const getTranslationListApi = (params: ContentTranslationQueryListDto) => {
  return request.post<Result<ContentTranslationListResponse>>(`${AIP_FIX}/i18n/list`, params);
};

/** 批量创建或更新翻译 */
export const batchUpsertTranslationsApi = (body: ContentTranslationBatchBody) => {
  return request.post<Result<number[]>>(`${AIP_FIX}/i18n/save/multi`, body);
};

/** 更新 */
export const updateApi = (body: ContentTranslationUpdateDto) => {
  return request.post<Result<null>>(`${AIP_FIX}/i18n/update/byid`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<null>>(`${AIP_FIX}/i18n/delete`, { id });
};

/** 导出 */
export const exportApi = (export_type?: ExportFileType) => {
  return request
    .post<Result<null>>(`${AIP_FIX}/i18n/export`, { export_type }, { responseType: 'blob' })
    .then(downloadResponseFile);
};
