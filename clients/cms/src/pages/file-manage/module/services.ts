import {
  FileManageListResponseDto,
  FileManageQueryListDto,
  FileManageAddOrRemoveTagsDto,
} from '@cms/api-interface';
import { request, AIP_FIX } from '@/request';
import { Result } from '@/types';

/** 列表 */
export const getListApi = (body: FileManageQueryListDto) => {
  return request.post<FileManageListResponseDto>(`${AIP_FIX}/file_manage/list`, body);
};
/** 更新 */
export const updateApi = (body: { desc: string; id: string }) => {
  return request.post<Result<string>>(`${AIP_FIX}/file_manage/update`, body);
};

/** 添加标签 */
export const addTagsApi = (body: FileManageAddOrRemoveTagsDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/file_manage/add_tags`, body);
};
/** 删除标签 */
export const removeTagsApi = (body: FileManageAddOrRemoveTagsDto) => {
  return request.post<Result<string>>(`${AIP_FIX}/file_manage/remove_tags`, body);
};

/** 删除 */
export const removeApi = (id: string) => {
  return request.post<Result<number>>(`${AIP_FIX}/file_manage/delete`, { id });
};
