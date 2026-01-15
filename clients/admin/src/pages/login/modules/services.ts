import { AIP_FIX } from '@/constants';
import { UserAdminLoginBody, UserAdminLoginResponse } from '@cms/api-interface';
import { request } from '@/request';

export const login = (body: UserAdminLoginBody) => {
  return request.post<UserAdminLoginResponse>(`${AIP_FIX}/login`, body);
};
