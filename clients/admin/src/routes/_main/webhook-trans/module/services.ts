import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';
import {
  WebhookTransCreateDto,
  WebhookTransDetailResponseDto,
  WebhookTransListResponseDto,
  WebhookTransQueryListDto,
  WebhookTransUpdateDto,
} from '@cms/api-interface';

/** 列表 */
export const getListApi = (params: WebhookTransQueryListDto) => {
  return request.get<WebhookTransListResponseDto>(`${AIP_FIX}/webhook_trans`, {
    params,
  });
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.get<WebhookTransDetailResponseDto>(`${AIP_FIX}/webhook_trans/${id}`);
};

/** 创建 */
export const createApi = (body: WebhookTransCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/webhook_trans`, body);
};

/** 修改 */
export const updateApi = (id: number | string, body: WebhookTransUpdateDto) => {
  return request.put<Result<string>>(`${AIP_FIX}/webhook_trans/${id}`, body);
};

/** 删除 */
export const removeApi = (id: number | string) => {
  return request.delete<Result<number>>(`${AIP_FIX}/webhook_trans/${id}`);
};
