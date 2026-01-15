import { AIP_FIX } from '@/constants';
import {
  TrackMetaEventCreateDto,
  TrackMetaEventDetailResponseDto,
  TrackMetaEventListResponseDto,
  TrackMetaEventQueryListDto,
  TrackMetaEventUpdateDto,
} from '@cms/api-interface';
import { request } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: TrackMetaEventQueryListDto) => {
  return request.post<TrackMetaEventListResponseDto>(`${AIP_FIX}/track_meta_event/list`, body);
};

/** 详情 */
export const getDetailApi = (id: number) => {
  return request.post<TrackMetaEventDetailResponseDto>(`${AIP_FIX}/track_meta_event/info`, { id });
};

/** 创建 */
export const createApi = (body: TrackMetaEventCreateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/track_meta_event/create`, body);
};

/** 修改 */
export const updateApi = (body: TrackMetaEventUpdateDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/track_meta_event/update`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.post<Result<number>>(`${AIP_FIX}/track_meta_event/delete`, { id });
};
