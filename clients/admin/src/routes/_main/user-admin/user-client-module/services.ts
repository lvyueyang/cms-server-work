import { AIP_FIX } from '@/constants';
import { UserClientListResponseDto } from '@cms/api-interface';
import { request } from '@/request';
import { Pagination } from '@/types';

/** 用户列表 */
export const getUserList = (pagination: Pagination) => {
  return request.post<UserClientListResponseDto>(`${AIP_FIX}/client-user/list`, pagination);
};
