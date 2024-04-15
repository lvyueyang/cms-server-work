import { AIP_FIX } from '@/constants';
import {
  UserAdminCreateDto,
  UserAdminIdResponseDto,
  UserAdminInfoResponseDto,
  UserAdminListResponseDto,
  UserAdminUpdateDto,
  UserAdminUpdatePasswordDto,
  UserAdminUpdateRolesDto,
} from '@cms/api-interface';
import { request } from '@/request';
import { Pagination, Result } from '@/types';

/** 用户列表 */
export const getUserList = (pagination: Pagination) => {
  return request.get<UserAdminListResponseDto>(`${AIP_FIX}/admin-user`, {
    params: {
      ...pagination,
    },
  });
};

/** 详情 */
export const getUserDetail = (id: number) => {
  return request.post<UserAdminInfoResponseDto>(`${AIP_FIX}/admin-user/${id}`);
};

/** 创建 */
export const createUser = (body: UserAdminCreateDto) => {
  return request.post<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user`, body);
};

/** 修改 */
export const updateUser = (id: number, body: UserAdminUpdateDto) => {
  return request.put<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user/${id}`, body);
};

/** 修改角色 */
export const updateRole = (id: number, body: UserAdminUpdateRolesDto) => {
  return request.put<Result<void>>(`${AIP_FIX}/admin-user/${id}/role`, body);
};

/** 重置密码 */
export const resetpasswordUser = (id: number, body: UserAdminUpdatePasswordDto) => {
  return request.post<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user/reset-password/${id}`, body);
};
