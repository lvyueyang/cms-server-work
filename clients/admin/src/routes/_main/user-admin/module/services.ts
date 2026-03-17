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
  return request.post<UserAdminListResponseDto>(`${AIP_FIX}/admin-user/list`, pagination);
};

/** 详情 */
export const getUserDetail = (id: number) => {
  return request.post<UserAdminInfoResponseDto>(`${AIP_FIX}/admin-user/info`, { id });
};

/** 创建 */
export const createUser = (body: UserAdminCreateDto) => {
  return request.post<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user/create`, body);
};

/** 修改 */
export const updateUser = (body: UserAdminUpdateDto) => {
  return request.post<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user/update`, body);
};

/** 修改角色 */
export const updateRole = (body: UserAdminUpdateRolesDto) => {
  return request.post<Result<void>>(`${AIP_FIX}/admin-user/update/role`, body);
};

/** 重置密码 */
export const resetpasswordUser = (body: UserAdminUpdatePasswordDto) => {
  return request.post<UserAdminIdResponseDto>(`${AIP_FIX}/admin-user/reset-password`, body);
};
