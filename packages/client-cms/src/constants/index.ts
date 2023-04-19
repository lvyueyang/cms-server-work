import { TypeValue } from '@/types';

/** 用户登录后储存在 cookie 中的 token */
export const TOKEN_COOKIE_KEY = 'token';

/** API 请求前缀 */
export const AIP_FIX = '/api/admin';

/** 发送验证码类型 */
export const SEND_VALIDATE_CODE_TYPE = {
  SMS: {
    id: 'sms',
    label: '手机短信',
  },
  EMAIL: {
    id: 'email',
    label: '邮箱',
  },
} as const;

export type SEND_VALIDATE_CODE_TYPE_ENUM = TypeValue<typeof SEND_VALIDATE_CODE_TYPE>['id'];

export const SEND_TYPE = {
  REGISTER: {
    id: 1,
    label: '注册',
  },
  NOPASSWORD: {
    id: 2,
    label: '忘记密码',
  },
  UPDATE: {
    id: 3,
    label: '更新邮箱/手机号',
  },
} as const;

export type SEND_TYPE_ENUM = TypeValue<typeof SEND_TYPE>['id'];
