import { AIP_FIX } from '@/constants';
import {
  AdminPermissionCodeListResponseDto,
  AdminRoleCreateDto,
  AdminRoleIdResponseDto,
  AdminRoleListResponseDto,
  AdminRoleUpdateDto,
  AdminRoleUpdatePermissionCodeDto,
} from '@cms/api-interface';
import { request } from '@/request';
import { Pagination } from '@/types';

/** 列表 */
export const getListApi = (params: Pagination) => {
  return request.get<AdminRoleListResponseDto>(`${AIP_FIX}/role`, {
    params,
  });
};

/** 权限码列表 */
export const getCodeListApi = () => {
  return request.get<AdminPermissionCodeListResponseDto>(`${AIP_FIX}/role/codes`, {});
};

/** 创建 */
export const createApi = (body: AdminRoleCreateDto) => {
  return request.post<AdminRoleIdResponseDto>(`${AIP_FIX}/role`, body);
};

/** 修改 */
export const updateApi = (id: number, body: AdminRoleUpdateDto) => {
  return request.put<AdminRoleIdResponseDto>(`${AIP_FIX}/role/${id}`, body);
};

/** 修改权限 */
export const updateCodeApi = (id: number, body: AdminRoleUpdatePermissionCodeDto) => {
  return request.put<AdminRoleIdResponseDto>(`${AIP_FIX}/role/${id}/codes`, body);
};

/** 删除 */
export const removeApi = (id: number) => {
  return request.delete<AdminRoleIdResponseDto>(`${AIP_FIX}/role/${id}`);
};
