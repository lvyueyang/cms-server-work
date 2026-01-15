import {
  EmailValidateCodeSendDto,
  FileManageInfo,
  SMSValidateCodeSendDto,
  UserAdminInfoResponseDto,
} from '@cms/api-interface';
import { AxiosProgressEvent } from 'axios';
import { AIP_FIX, TOKEN_KEY } from '@/constants';
import { request } from '@/request';
import { Result } from '@/types';

/** 获取当前登录用户信息 */
export const getUserInfo = () => {
  return request.get<UserAdminInfoResponseDto>(`${AIP_FIX}/userinfo`, {
    ignoreNotice: true,
  });
};

/** 退出登录 */
export const outLogin = () => {
  return request.post<Result<null>>(`${AIP_FIX}/outlogin`).then(() => {
    localStorage.removeItem(TOKEN_KEY);
  });
};

export const uploadFile = (
  file: File,
  options?: {
    onUploadProgress?: (p: AxiosProgressEvent) => void;
    tags?: string[];
  }
) => {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.tags?.length) {
    formData.append('tags', options.tags.join(','));
  }
  return request.post<Result<FileManageInfo>>(`${AIP_FIX}/file_manage/upload`, formData, {
    onUploadProgress: options?.onUploadProgress,
  });
};

/** 发送短信验证码 */
export const sendSMSCaptcha = (body: SMSValidateCodeSendDto) => {
  return request.post<Result<any>>(`${AIP_FIX}/validate-code/send/sms`, body);
};

/** 发送邮箱验证码 */
export const sendEmailCaptcha = (body: EmailValidateCodeSendDto) => {
  console.log('body: ', body);
  return request.post<Result<any>>(`${AIP_FIX}/validate-code/send/email`, body);
};
