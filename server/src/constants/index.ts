// 前端资源路径前缀
export const FE_PREFIX = '/_fe_';

/** 验证码类型 */
export enum VALIDATE_CODE_TYPE {
  /** 管理后台账号忘记密码 */
  ADMIN_USER_FORGET_PASSWORD = 'admin_user_forget_password',

  /** 管理后台账号换绑邮箱-旧邮箱 */
  ADMIN_USER_BIND_EMAIL_OLD = 'admin_user_bind_email_old',

  /** 管理后台账号换绑邮箱-新邮箱 */
  ADMIN_USER_BIND_EMAIL_NEW = 'admin_user_bind_email_new',

  /** 客户端账号忘记密码 */
  USER_CLIENT_FORGET_PASSWORD = 'user_client_forget_password',

  /** 客户端账号注册 */
  USER_CLIENT_PHONE_REGISTER = 'user_client_phone_register',

  /** 客户端手机账号登录 */
  USER_CLIENT_PHONE_LOGIN = 'user_client_phone_login',
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

export enum ExportFileType {
  XLSX = 'xlsx',
  JSON = 'json',
}

/** 属性类型 */
export enum META_PROPERTIES_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATETIME = 'DATETIME',
  LIST = 'LIST',
}
export const META_PROPERTIES_TYPE_MAP = new Map([
  [
    META_PROPERTIES_TYPE.STRING,
    {
      label: '字符串',
    },
  ],
  [
    META_PROPERTIES_TYPE.NUMBER,
    {
      label: '数字',
    },
  ],
  [
    META_PROPERTIES_TYPE.BOOLEAN,
    {
      label: '布尔值',
    },
  ],
  [
    META_PROPERTIES_TYPE.DATETIME,
    {
      label: '日期时间',
    },
  ],
  [
    META_PROPERTIES_TYPE.LIST,
    {
      label: '列表',
    },
  ],
]);
