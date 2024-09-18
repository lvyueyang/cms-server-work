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
