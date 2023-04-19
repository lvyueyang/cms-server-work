import { AIP_FIX } from '@/constants';
import { UserAdminLoginBody, UserAdminLoginResponse } from '@/interface/serverApi';
import request from '@/services/request';

export const login = (body: UserAdminLoginBody) => {
  return request.post<UserAdminLoginResponse>(`${AIP_FIX}/login`, body);
};
