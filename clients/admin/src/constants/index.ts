/** 用户登录后储存在 cookie 中的 token */
export const TOKEN_KEY = 'token';

/** API 请求前缀 */
export const AIP_FIX = '/api/admin';

export const enum SendPhoneCaptchaType {
  /** 手机号注册 */
  Register = 'send_phone_code',
  /** 忘记密码 */
  ForgetPassword = 'forget_phone_code',
  /** 更新手机号 */
  Update = 'update_phone_code',
}

export const enum SendEmailCaptchaType {
  /** 邮箱注册 */
  Register = 'send_email_code',
  /** 邮箱更新 */
  Update = 'update_email_code',
}
export const enum ContentType {
  /** 输入框 */
  INPUT = 'input',
  /** 文本 */
  TEXT = 'text',
  /** 代码 */
  Code = 'code',
  /** Json */
  Json = 'json',
  /** 富文本 */
  Rich = 'rich',
  /** 低代码 */
  LowCode = 'lowcode',
  /** 图片 */
  IMAGE = 'image',
  /** 文件 */
  FILE = 'file',
}
export const ContentTypeMap = new Map([
  [ContentType.INPUT, { label: '单行文本', value: ContentType.INPUT }],
  [ContentType.TEXT, { label: '多行文本', value: ContentType.TEXT }],
  [ContentType.Code, { label: '代码', value: ContentType.Code }],
  [ContentType.Json, { label: 'Json', value: ContentType.Json }],
  [ContentType.Rich, { label: '富文本', value: ContentType.Rich }],
  [ContentType.LowCode, { label: '低代码', value: ContentType.LowCode }],
  [ContentType.IMAGE, { label: '图片', value: ContentType.IMAGE }],
  [ContentType.FILE, { label: '文件', value: ContentType.FILE }],
]);
