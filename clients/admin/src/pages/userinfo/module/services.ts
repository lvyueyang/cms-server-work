import { UserAdminBindEmailDto } from '@cms/api-interface';
import { AIP_FIX } from '@/constants';
import { request } from '@/request';
import { Result } from '@/types';
import { UpdatePasswordBody } from './types';

/** 修改密码 */
export const updatePassword = (body: UpdatePasswordBody) => {
  return request.post<Result<void>>(`${AIP_FIX}/user/UpdateUserInfo`, body);
};

/** 邮箱换绑 */
export const bindEmailApi = (body: UserAdminBindEmailDto) => {
  return request.post<Result<void>>(`${AIP_FIX}/user/bind-email`, body);
};
