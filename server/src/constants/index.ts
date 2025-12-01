/** 用户账号类型 */
export const enum USER_PONIT_TYPE {
  /** 管理后台用户 */
  AMDIN = 'admin',
  /** 前台用户 */
  NORMAL = 'user',
}

/** 验证码类型 */
export const enum VALIDATE_CODE_TYPE {
  /** 忘记密码 */
  FORGET_PASSWORD = 'forget_password',
}

export const enum SMS_CODE_KEY {
  // C端用户登录注册
  USER_LOGIN = 'user-login',
}

export const PERM_CODE_METADATA = 'PERM_CODE_ITEM';

export enum ContentLang {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
}
export const ContentLangMap = new Map([
  [ContentLang.ZH_CN, { label: '中文', value: ContentLang.ZH_CN }],
  [ContentLang.EN_US, { label: '英文', value: ContentLang.EN_US }],
]);
