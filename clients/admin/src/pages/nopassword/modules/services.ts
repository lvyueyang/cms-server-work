import { AIP_FIX } from '@/constants';
import { UserAdminForgetPasswordDto, UserAdminInfo } from '@cms/api-interface';
import { request } from '@/request';

export const forgetPassword = (body: UserAdminForgetPasswordDto) => {
  return request.post<UserAdminInfo>(`${AIP_FIX}/forget-password`, body);
};
