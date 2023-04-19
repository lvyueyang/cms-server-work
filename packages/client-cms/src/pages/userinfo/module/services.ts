import { AIP_FIX } from '@/constants';
import request from '@/services/request';

import { Result } from '@/types';
import { UpdatePasswordBody } from './types';

/** 修改密码 */
export const updatePassword = (body: UpdatePasswordBody) => {
  return request.post<Result<void>>(`${AIP_FIX}/user/UpdateUserInfo`, body);
};
