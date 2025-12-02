import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

export interface I18nItem {
  id: number;
  entity: string;
  entityId: number;
  field: string;
  lang: string;
  value: string;
  create_date?: string;
  update_date?: string;
}

export interface I18nListResult {
  list: I18nItem[];
  total: number;
}

export function queryTranslations(params: { entity: string; entityId: number; field: string }) {
  return request.post<Result<I18nListResult>>(`${AIP_FIX}/i18n/list/by-entity`, params);
}

export function upsertTranslation(body: {
  entity: string;
  entityId: number;
  field: string;
  lang: string;
  value: string;
}) {
  return request.post<Result<number>>(`${AIP_FIX}/i18n/save`, body);
}
