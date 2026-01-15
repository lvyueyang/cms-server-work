/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ResponseResult {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
}

export interface UserAdminLoginBody {
  /** 密码 */
  password: string;
  /** 用户名/邮箱 */
  username: string;
}

export interface UserAdminLoginResponse {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    token: string;
  };
}

export interface UserAdminOutLoginResponse {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
}

export interface UserClientQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
}

export interface UserClient {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 客户端端用户 ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 邮箱地址 */
  email: string;
  /** 手机号码 */
  phone: string;
  /**
   * 退出登录时间
   * @format date-time
   */
  out_login_date?: string;
}

export interface UserClientList {
  list: UserClient[];
  total: number;
}

export interface UserClientListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: UserClientList;
}

export interface UserClientResetPasswordDto {
  /** 用户密码 */
  password: string;
  /** 手机号码 */
  phone: string;
  /** 短信验证码 */
  code: string;
}

export interface UserClientRegisterDto {
  /** 用户密码 */
  password: string;
  /** 手机号码 */
  phone: string;
  /** 短信验证码 */
  code: string;
}

export interface UserClientLoginByPasswordDto {
  /** 用户密码 */
  password: string;
  /** 手机号码 */
  phone: string;
  /** 回调地址 */
  redirect_uri?: string;
}

export interface UserClientLoginByCodeDto {
  /** 手机号码 */
  phone: string;
  /** 短信验证码 */
  code: string;
  /** 回调地址 */
  redirect_uri?: string;
}

export interface ImageValidateCodeResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    data: string;
    hash: string;
  };
}

export interface SMSValidateCodeSendDto {
  /** 图片验证码 */
  image_code: string;
  /** 图片验证码 HASH */
  image_code_hash: string;
  /** 验证码用途 */
  type:
    | "admin_user_forget_password"
    | "admin_user_bind_email_old"
    | "admin_user_bind_email_new"
    | "user_client_forget_password"
    | "user_client_phone_register"
    | "user_client_phone_login";
  /** 手机号 */
  phone: string;
}

export interface EmailValidateCodeSendDto {
  /** 图片验证码 */
  image_code: string;
  /** 图片验证码 HASH */
  image_code_hash: string;
  /** 验证码用途 */
  type:
    | "admin_user_forget_password"
    | "admin_user_bind_email_old"
    | "admin_user_bind_email_new"
    | "user_client_forget_password"
    | "user_client_phone_register"
    | "user_client_phone_login";
  /** 邮箱 */
  email: string;
}

export interface UserAdminQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
}

export interface AdminRole {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
  /** 权限码 */
  permission_code?: string[];
  /** 关联用户 */
  users: string[];
}

export interface UserAdminInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 管理账户 ID */
  id: number;
  /** 用户头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
  /** 是否为根用户 */
  is_root?: boolean;
  /**
   * 退出登录时间
   * @format date-time
   */
  out_login_date?: string;
  /** 关联角色 */
  roles: AdminRole[];
  /** 新闻 */
  news: string[];
}

export interface UserAdminList {
  list: UserAdminInfo[];
  total: number;
}

export interface UserAdminListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: UserAdminList;
}

export interface UserAdminCreateDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
}

export interface UserAdminIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 用户 ID */
  data: number;
}

export interface UserAdminParamsInfoDto {
  /** 管理账户 ID */
  id: number;
}

export interface UserAdminInfoResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: UserAdminInfo;
}

export interface UserAdminUpdateDto {
  /** 管理账户 ID */
  id: number;
  /** 用户头像 */
  avatar: string;
  /** 用户昵称 */
  cname: string;
}

export interface UserAdminUpdatePasswordDto {
  /** 管理账户 ID */
  id: number;
  /** 密码 */
  password: string;
}

export interface UserAdminUpdateRolesDto {
  /** 管理账户 ID */
  id: number;
  /** 角色 ID */
  roles: number[];
}

export interface UserAdminForgetPasswordDto {
  /** 密码 */
  password: string;
  /** 用户邮箱 */
  email: string;
  /** 验证码 */
  code: string;
}

export interface UserAdminBindEmailDto {
  /** 旧邮箱验证码 */
  old_email_code: string;
  /** 新邮箱 */
  new_email: string;
  /** 验证码 */
  new_email_code: string;
}

export interface UserAdminFileUploadDto {
  /** @format binary */
  file: File;
}

export interface UserAdminCreateRootDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
}

export interface AdminRoleCreateDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
}

export interface AdminRoleIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 角色 ID */
  data: number;
}

export interface AdminRoleInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
  /** 权限码 */
  permission_code?: string[];
}

export interface AdminRoleList {
  list: AdminRoleInfo[];
  total: number;
}

export interface AdminRoleListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: AdminRoleList;
}

export interface CodeInfo {
  code: string;
  cname: string;
}

export interface AdminPermissionCodeListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: CodeInfo[];
}

export interface AdminRoleInfoResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 角色详情 */
  data: AdminRoleInfo;
}

export interface AdminRoleUpdateDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
}

export interface AdminRoleUpdatePermissionCodeDto {
  /** 权限码 */
  codes: string[];
}

export interface LoggerListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 日志列表 */
  data: string[];
}

export interface LoggerDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 日志详情 */
  data: string[];
}

export interface WebhookTransQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** Webhook中转名称-模糊搜索 */
  keyword?: string;
}

export interface UserAdmin {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 管理账户 ID */
  id: number;
  /** 用户头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
  /** 是否为根用户 */
  is_root?: boolean;
  /**
   * 退出登录时间
   * @format date-time
   */
  out_login_date?: string;
  /** 关联角色 */
  roles: AdminRole[];
  /** 新闻 */
  news: string[];
}

export interface WebhookTransInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** Webhook中转 ID */
  id: number;
  /** 唯一标识 */
  code: string;
  /** Webhook中转描述 */
  desc?: string;
  /** 前置钩子函数 */
  before_hook_func: string;
  /** 数据转换函数 */
  data_trans_func: string;
  /** 回调函数 */
  callback_func: string;
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method: string;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
  /** Webhook中转创建者 ID */
  authorId?: number;
  /** Webhook中转创建者 */
  author: UserAdmin;
}

export interface WebhookTransList {
  list: WebhookTransInfo[];
  total: number;
}

export interface WebhookTransListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: WebhookTransList;
}

export interface WebhookTransDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: WebhookTransInfo;
}

export interface WebhookTransCreateDto {
  /** 唯一标识 */
  code: string;
  /** Webhook中转描述 */
  desc?: string;
  /** 前置钩子函数 */
  before_hook_func: string;
  /** 数据转换函数 */
  data_trans_func: string;
  /** 回调函数 */
  callback_func: string;
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method: string;
  /** 是否可用 */
  is_available: boolean;
}

export interface WebhookTransUpdateDto {
  /** 唯一标识 */
  code?: string;
  /** Webhook中转描述 */
  desc?: string;
  /** 前置钩子函数 */
  before_hook_func?: string;
  /** 数据转换函数 */
  data_trans_func?: string;
  /** 回调函数 */
  callback_func?: string;
  /** 请求地址 */
  url?: string;
  /** 请求方法 */
  method?: string;
  /** 是否可用 */
  is_available?: boolean;
}

export interface WebhookTransDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface FileUploadDto {
  /** @format binary */
  file: File;
  /** 文件标签 */
  tags: string[];
}

export interface FileManageQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 文件管理名称-模糊搜索 */
  keyword?: string;
}

export interface FileManageInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 文件 ID */
  id: string;
  /** 文件名称 */
  name: string;
  /** 文件大小 */
  size: number;
  /** 文件扩展名 */
  ext: string;
  /** 文件类型 */
  type: string;
  /** 文件哈希值 */
  hash: string;
  /** 文件路径 */
  local_path: string;
  /** 文件标签 */
  tags: string[];
  /** 文件备注 */
  desc?: string;
  /** 登录后可下载 */
  login_download_auth?: boolean;
  /** 是否已删除 */
  is_delete: boolean;
  /** 文件管理创建者 ID */
  authorId?: number;
  /** 文件创建者 */
  author: UserAdmin;
}

export interface FileManageList {
  /** 列表 */
  list: FileManageInfo[];
  /** 总数 */
  total: number;
}

export interface FileManageListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: FileManageList;
}

export type StreamableFile = object;

export interface FileManageUpdateDto {
  /** 文件 ID */
  id: string;
  /** 文件备注 */
  desc?: string;
  /** 登录后可下载 */
  login_download_auth?: boolean;
}

export interface FileManageDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface FileManageRenameDto {
  /** 文件 ID */
  id: string;
  /** 文件名称 */
  name: string;
}

export interface FileManageAddOrRemoveTagsDto {
  /** 文件 ID */
  id: string;
  /** 文件标签 */
  tags: string[];
}

export interface FileManageByIdParamDto {
  /** 文件 ID */
  id: string;
}

export interface ContentTranslationUpsertBodyDto {
  /** 实体名，如 news、product */
  entity: string;
  /** 实体记录 ID */
  entityId: string;
  /** 字段名，如 title、desc、content */
  field: string;
  /** 语言代码 */
  lang: "zh-CN" | "en-US";
  /** 翻译值 */
  value: string;
}

export interface ContentTranslationUpsertResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 翻译记录 ID */
  data: number;
}

export interface ExportParamsDto {
  /** 导出文件类型 */
  export_type: "xlsx" | "json";
}

export interface ContentTranslationQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 实体名，如 news、product */
  entity: string;
  /** 字段名，如 title、desc、content */
  field: string;
  /** 语言代码 */
  lang: ("zh-CN" | "en-US")[];
  /** 翻译值 */
  value: string;
}

export interface ContentTranslationInfo {
  /** 实体名，如 news、product */
  entity: string;
  /** 实体记录 ID */
  entityId: string;
  /** 字段名，如 title、desc、content */
  field: string;
  /** 语言代码 */
  lang: "zh-CN" | "en-US";
  /** 翻译值 */
  value: string;
  id: number;
}

export interface ContentTranslationList {
  /** 列表 */
  list: ContentTranslationInfo[];
  /** 总数 */
  total: number;
}

export interface ContentTranslationListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: ContentTranslationList;
}

export interface ContentTranslationQueryParamsDto {
  /** 实体记录 ID */
  entityId?: string;
  /** 字段名，如 title、desc、content */
  field?: string;
  /** 语言代码 */
  lang?: "zh-CN" | "en-US";
  /** 实体名，如 news、product */
  entity: string;
}

export interface ContentTranslationMulitUpsertBodyDto {
  /** 批量翻译数据 */
  translations: ContentTranslationUpsertBodyDto[];
}

export interface ContentTranslationMulitUpsertResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 翻译记录 ID 列表 */
  data: number[];
}

export interface ContentTranslationUpdateDto {
  /** 翻译值 */
  value: string;
  id: number;
}

export interface ContentTranslationByIdParamDto {
  /** 翻译记录 ID */
  id: number;
}

export interface SystemTranslationQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** Key */
  key?: string;
  /** 语言 */
  lang?: "zh-CN" | "en-US";
  /** 值 */
  value?: string;
}

export interface SystemTranslationInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 国际化 ID */
  id: number;
  /** 国际化Key */
  key: string;
  /** 国际化描述 */
  desc?: string;
  /** 国际化Value类型 */
  value_type: string;
  /** 国际化Value */
  value: string;
  /** 语言 */
  lang: "zh-CN" | "en-US";
}

export interface SystemTranslationList {
  /** 列表 */
  list: SystemTranslationInfo[];
  /** 总数 */
  total: number;
}

export interface SystemTranslationListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: SystemTranslationList;
}

export interface SystemTranslationByIdParamDto {
  /** 国际化 ID */
  id: number;
}

export interface SystemTranslationDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: SystemTranslationInfo;
}

export interface SystemTranslationCreateDto {
  /** 国际化Key */
  key: string;
  /** 国际化描述 */
  desc?: string;
  /** 国际化Value类型 */
  value_type: string;
  /** 国际化Value */
  value: string;
  /** 语言 */
  lang: "zh-CN" | "en-US";
}

export interface SystemTranslationMultiCreateDto {
  list: SystemTranslationCreateDto[];
}

export interface SystemTranslationUpdateDto {
  /** 国际化Key */
  key?: string;
  /** 国际化描述 */
  desc?: string;
  /** 国际化Value类型 */
  value_type?: string;
  /** 国际化Value */
  value?: string;
  /** 语言 */
  lang?: "zh-CN" | "en-US";
  /** 国际化 ID */
  id: number;
}

export interface SystemTranslationDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface DictType {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 字典类型 ID */
  id: number;
  /** 字典名称 */
  name: string;
  /** 字典类型 */
  type: string;
  /** 字典描述 */
  desc?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
  /** 字典值列表 */
  values: DictValue[];
}

export interface DictValue {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 字典值 ID */
  id: number;
  /** 字典值名称 */
  label: string;
  /** 字典值 */
  value: string;
  /** 字典值附加属性 */
  attr?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 类型ID */
  typeId: number;
  /**
   * 排序
   * @min 0
   */
  recommend: number;
  /** 字典值描述 */
  desc?: string;
  /** 是否可用 */
  is_available: boolean;
  type: DictType;
}

export interface DictTypeInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 字典类型 ID */
  id: number;
  /** 字典名称 */
  name: string;
  /** 字典类型 */
  type: string;
  /** 字典描述 */
  desc?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
  /** 字典值列表 */
  values: DictValue[];
}

export interface DictTypeListAllResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: DictTypeInfo[];
}

export interface DictTypeQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 字典类型名称-模糊搜索 */
  keyword?: string;
}

export interface DictTypeList {
  list: DictTypeInfo[];
  total: number;
}

export interface DictTypeListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: DictTypeList;
}

export interface DictTypeByIdParamDto {
  /** 字典类型 ID */
  id: number;
}

export interface DictTypeDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: DictTypeInfo;
}

export interface DictTypeCreateDto {
  /** 字典名称 */
  name: string;
  /** 字典类型 */
  type: string;
  /** 字典描述 */
  desc?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 是否可用 */
  is_available: boolean;
}

export interface DictTypeUpdateDto {
  /** 字典名称 */
  name?: string;
  /** 字典类型 */
  type?: string;
  /** 字典描述 */
  desc?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 是否可用 */
  is_available?: boolean;
  /** 字典类型 ID */
  id: number;
}

export interface DictTypeDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface DictValueQueryListByTypeDto {
  /** 字典类型 */
  type: string;
}

export interface DictValueInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 字典值 ID */
  id: number;
  /** 字典值名称 */
  label: string;
  /** 字典值 */
  value: string;
  /** 字典值附加属性 */
  attr?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 类型ID */
  typeId: number;
  /**
   * 排序
   * @min 0
   */
  recommend: number;
  /** 字典值描述 */
  desc?: string;
  /** 是否可用 */
  is_available: boolean;
  type: DictType;
}

export interface DictValueListByTypeResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    type: DictType;
    list: DictValueInfo[];
  };
}

export interface DictValueQueryListDto {
  /** 字典值名称-模糊搜索 */
  keyword?: string;
  /** 字典类型ID */
  typeId: number;
}

export interface DictValueList {
  list: DictValueInfo[];
  total: number;
}

export interface DictValueListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: DictValueList;
}

export interface DictValueByIdParamDto {
  /** 字典值 ID */
  id: number;
}

export interface DictValueDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: DictValueInfo;
}

export interface DictValueCreateDto {
  /** 字典值名称 */
  label: string;
  /** 字典值 */
  value: string;
  /** 字典值附加属性 */
  attr?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /** 类型ID */
  typeId: number;
  /**
   * 排序
   * @min 0
   */
  recommend: number;
  /** 字典值描述 */
  desc?: string;
  /** 是否可用 */
  is_available: boolean;
}

export interface DictValueUpdateDto {
  /** 字典值名称 */
  label?: string;
  /** 字典值 */
  value?: string;
  /** 字典值附加属性 */
  attr?: string;
  /** 附加属性类型：例如 code rich lowcode */
  attr_type?: string;
  /**
   * 排序
   * @min 0
   */
  recommend?: number;
  /** 字典值描述 */
  desc?: string;
  /** 是否可用 */
  is_available?: boolean;
  /** 字典值 ID */
  id: number;
}

export interface DictValueDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface DictValueDeleteDto {
  /** 字典值 ID */
  id: number[];
}

export interface SystemConfigQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 系统配置名称-模糊搜索 */
  keyword?: string;
}

export interface SystemConfigInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 系统配置 ID */
  id: number;
  /** 编码 */
  code: string;
  /** 系统配置标题 */
  title: string;
  /** 系统配置内容类型 */
  content_type: string;
  /** 系统配置详情 */
  content: string;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
}

export interface SystemConfigList {
  /** 列表 */
  list: SystemConfigInfo[];
  /** 总数 */
  total: number;
}

export interface SystemConfigListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: SystemConfigList;
}

export interface SystemConfigByIdParamDto {
  /** 系统配置 ID */
  id: number;
}

export interface SystemConfigDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: SystemConfigInfo;
}

export interface SystemConfigCreateDto {
  /** 编码 */
  code: string;
  /** 系统配置标题 */
  title: string;
  /** 系统配置内容类型 */
  content_type: string;
  /** 系统配置详情 */
  content: string;
  /** 是否可用 */
  is_available: boolean;
}

export interface SystemConfigUpdateDto {
  /** 编码 */
  code?: string;
  /** 系统配置标题 */
  title?: string;
  /** 系统配置内容类型 */
  content_type?: string;
  /** 系统配置详情 */
  content?: string;
  /** 是否可用 */
  is_available?: boolean;
  /** 系统配置 ID */
  id: number;
}

export interface SystemConfigDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface TrackMetaEventQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 元事件名称-模糊搜索 */
  keyword?: string;
}

export interface TrackMetaProperties {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 元属性 ID */
  id: number;
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: "STRING" | "NUMBER" | "BOOLEAN" | "DATETIME" | "LIST";
  /** 是否已删除 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
}

export interface TrackMetaEvent {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 元事件 ID */
  id: number;
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 是否已删除 */
  is_delete: boolean;
  /** 元事件创建者 ID */
  authorId?: number;
  /** 事件属性 */
  properties?: TrackMetaProperties[];
  trackEvents: TrackEvent[];
}

export interface TrackEventProperties {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 属性名称 */
  key: string;
  /** 属性值 */
  value: string;
  /** 属性类型 */
  type: "STRING" | "NUMBER" | "BOOLEAN" | "DATETIME" | "LIST";
  /** 事件记录 */
  trackEvent: TrackEvent;
}

export interface TrackEvent {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 事件分析 ID */
  id: number;
  /** 事件名称 */
  name: string;
  /** 元事件ID */
  metaEventId: number;
  /** 元事件信息 */
  metaEvent: TrackMetaEvent;
  /** 关联用户 ID */
  userId: string;
  /** 关联用户 */
  user?: UserClient;
  /** 事件属性 */
  properties: TrackEventProperties[];
}

export interface TrackMetaEventInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 元事件 ID */
  id: number;
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 是否已删除 */
  is_delete: boolean;
  /** 元事件创建者 ID */
  authorId?: number;
  /** 事件属性 */
  properties?: TrackMetaProperties[];
  trackEvents: TrackEvent[];
}

export interface TrackMetaEventList {
  list: TrackMetaEventInfo[];
  total: number;
}

export interface TrackMetaEventListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 查询结果 */
  data: TrackMetaEventList;
}

export interface TrackMetaEventByIdParamDto {
  /** 元事件 ID */
  id: number;
}

export interface TrackMetaEventDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: TrackMetaEventInfo;
}

export interface TrackMetaEventCreateDto {
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 事件属性名称列表 */
  properties: string[];
}

export interface TrackMetaEventUpdateDto {
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 事件属性名称列表 */
  properties: string[];
  /** 事件属性ID */
  id: number;
}

export interface TrackMetaEventDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface TrackMetaPropertiesQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 元属性名称-模糊搜索 */
  name?: string;
  /** 元属性名称-模糊搜索 */
  cname?: string;
}

export interface TrackMetaPropertiesInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 元属性 ID */
  id: number;
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: "STRING" | "NUMBER" | "BOOLEAN" | "DATETIME" | "LIST";
  /** 是否已删除 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
}

export interface TrackMetaPropertiesListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    list: TrackMetaPropertiesInfo[];
    total: number;
  };
}

export interface TrackMetaPropertiesByIdParamDto {
  /** 元属性 ID */
  id: number;
}

export interface TrackMetaPropertiesDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: TrackMetaPropertiesInfo;
}

export interface TrackMetaPropertiesCreateDto {
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: "STRING" | "NUMBER" | "BOOLEAN" | "DATETIME" | "LIST";
}

export interface TrackMetaPropertiesUpdateDto {
  /** 元属性 ID */
  id: number;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
}

export interface TrackMetaPropertiesDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface GetTrackEventListQueryDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 按名称搜索 */
  name?: string;
  /** 开始时间 */
  start_date?: string;
  /** 结束时间 */
  end_date?: string;
  /** 属性 Key */
  properties_key?: string;
  /** 属性 value 模糊匹配 */
  properties_value?: string;
}

export interface GetTrackEventListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    list: TrackEvent[];
    total: number;
  };
}

export interface GetTrackEventChartQueryDto {
  /** 事件名称 */
  name: string;
  /** 开始时间 */
  start_date: string;
  /** 结束时间 */
  end_date: string;
  /** 属性 Key */
  properties_key?: string;
  /** 属性 value 模糊匹配 */
  properties_value?: string;
}

export interface ChartItem {
  /** 日期 */
  date: string;
  /** 数量 */
  count: number;
}

export interface GetTrackEventChartResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 结果 */
  data: ChartItem[];
}

export interface BannerQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 广告名称-模糊搜索 */
  keyword?: string;
}

export interface BannerInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 广告 ID */
  id: number;
  /** 广告标题 */
  title: string;
  /** 广告封面图 */
  cover: string;
  /** 广告位置 */
  position: string;
  /** 广告链接 */
  url: string;
  /** 广告描述 */
  desc?: string;
  /** 广告详情 */
  content?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
  /** 广告创建者 ID */
  authorId?: number;
}

export interface BannerList {
  /** 列表 */
  list: BannerInfo[];
  /** 总数 */
  total: number;
}

export interface BannerListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: BannerList;
}

export interface BannerByIdParamDto {
  /** 广告 ID */
  id: number;
}

export interface BannerDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: BannerInfo;
}

export interface BannerCreateDto {
  /** 广告标题 */
  title: string;
  /** 广告封面图 */
  cover: string;
  /** 广告位置 */
  position: string;
  /** 广告链接 */
  url: string;
  /** 广告描述 */
  desc?: string;
  /** 广告详情 */
  content?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
}

export interface BannerUpdateDto {
  /** 广告标题 */
  title?: string;
  /** 广告封面图 */
  cover?: string;
  /** 广告位置 */
  position?: string;
  /** 广告链接 */
  url?: string;
  /** 广告描述 */
  desc?: string;
  /** 广告详情 */
  content?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend?: number;
  /** 是否可用 */
  is_available?: boolean;
  /** 广告 ID */
  id: number;
}

export interface BannerDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface NewsQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 新闻名称-模糊搜索 */
  keyword?: string;
}

export interface NewsInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 标题 */
  title: string;
  /** 封面图 */
  cover: string;
  /** 描述 */
  desc?: string;
  /** 详情 */
  content: string;
  /**
   * 发布时间
   * @format date-time
   */
  push_date?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
  /** 描述 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
  /** 创建者 */
  author: UserAdmin;
}

export interface NewsList {
  /** 列表 */
  list: NewsInfo[];
  /** 总数 */
  total: number;
}

export interface NewsListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: NewsList;
}

export interface NewsByIdParamDto {
  /** 新闻 ID */
  id: number;
}

export interface NewsDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: NewsInfo;
}

export interface NewsCreateDto {
  /** 标题 */
  title: string;
  /** 封面图 */
  cover: string;
  /** 描述 */
  desc?: string;
  /** 详情 */
  content: string;
  /**
   * 发布时间
   * @format date-time
   */
  push_date?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
}

export interface NewsUpdateDto {
  /** 标题 */
  title?: string;
  /** 封面图 */
  cover?: string;
  /** 描述 */
  desc?: string;
  /** 详情 */
  content?: string;
  /**
   * 发布时间
   * @format date-time
   */
  push_date?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend?: number;
  /** 是否可用 */
  is_available?: boolean;
  /** 新闻 ID */
  id: number;
}

export interface NewsDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}

export interface PublicArticleQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 被排序的字段 key */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 开放文章名称-模糊搜索 */
  keyword?: string;
}

export interface PublicArticleInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 开放文章 ID */
  id: number;
  /** 开放文章编码 */
  code: string;
  /** 开放文章标题 */
  title: string;
  /** 开放文章封面图 */
  cover: string;
  /** 开放文章描述 */
  desc?: string;
  /** 内容类型 */
  content_type: string;
  /** 开放文章详情 */
  content: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
  /** 是否已删除 */
  is_delete: boolean;
}

export interface PublicArticleList {
  /** 列表 */
  list: PublicArticleInfo[];
  /** 总数 */
  total: number;
}

export interface PublicArticleListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: PublicArticleList;
}

export interface PublicArticleByIdParamDto {
  /** 开放文章 ID */
  id: number;
}

export interface PublicArticleDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: PublicArticleInfo;
}

export interface PublicArticleCreateDto {
  /** 开放文章编码 */
  code: string;
  /** 开放文章标题 */
  title: string;
  /** 开放文章封面图 */
  cover: string;
  /** 开放文章描述 */
  desc?: string;
  /** 内容类型 */
  content_type: string;
  /** 开放文章详情 */
  content: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  /** 是否可用 */
  is_available: boolean;
}

export interface PublicArticleUpdateDto {
  /** 开放文章编码 */
  code?: string;
  /** 开放文章标题 */
  title?: string;
  /** 开放文章封面图 */
  cover?: string;
  /** 开放文章描述 */
  desc?: string;
  /** 内容类型 */
  content_type?: string;
  /** 开放文章详情 */
  content?: string;
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend?: number;
  /** 是否可用 */
  is_available?: boolean;
  /** 开放文章 ID */
  id: number;
}

export interface PublicArticleDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}
