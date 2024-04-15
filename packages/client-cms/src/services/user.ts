import { AIP_FIX, SendEmailCaptchaType, SendPhoneCaptchaType, TOKEN_KEY } from '@/constants';
import { UserAdminInfoResponseDto } from '@cms/api-interface';
import { Result } from '@/types';
import { request } from '@/request';
import { AxiosProgressEvent } from 'axios';

/** 获取当前登录用户信息 */
export const getUserInfo = () => {
  return request.get<UserAdminInfoResponseDto>(`${AIP_FIX}/userinfo`, { ignoreNotice: true });
};

/** 退出登录 */
export const outLogin = () => {
  return request.post<Result<null>>(`${AIP_FIX}/outlogin`).then(() => {
    localStorage.removeItem(TOKEN_KEY);
  });
};

export const uploadFile = (
  file: File,
  options?: { onUploadProgress?: (p: AxiosProgressEvent) => void },
) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<Result<string>>(`${AIP_FIX}/upload`, formData, {
    onUploadProgress: options?.onUploadProgress,
  });
};

/** 发送短信验证码 */
export const sendSMSCaptcha = (phone: string, send_type: SendPhoneCaptchaType) => {
  return request.post<Result<any>>(`${AIP_FIX}/user/send-code`, { phone, send_type });
};

/** 发送邮箱验证码 */
export const sendEmailCaptcha = (email: string, send_type: SendEmailCaptchaType) => {
  return request.post<Result<any>>(`${AIP_FIX}/user/send-check-email-code`, {
    email,
    send_type,
  });
};
