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
  /** 用户名 */
  username: string;
  /** 用户密码 */
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
  /** 昵称 */
  cname: string;
  /** 邮箱 */
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
  /** 昵称 */
  cname: string;
}

export interface UserAdminUpdatePasswordDto {
  /** 密码 */
  password: string;
}

export interface UserAdminUpdateRolesDto {
  /** 角色 ID */
  roles: number[];
}

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

export interface UserAdminForgetPasswordDto {
  /** 邮箱 */
  email: string;
  /** 验证码 */
  code: string;
  /** 密码 */
  password: string;
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
  /** 昵称 */
  cname: string;
  /** 邮箱 */
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

export interface EmailValidateCodeCreateDto {
  /** 邮箱 */
  email: string;
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

export interface SMSValidateCodeCreateDto {
  /** 手机号 */
  phone: string;
  /** 图片验证码 */
  image_code: string;
  /** 图片验证码 HASH */
  image_code_hash: string;
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
  /** 用户名 */
  username: string;
  /** 用户密码 */
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
  desc: string;
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

export interface FileManageDetailResponseDto {
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
  data: FileManageInfo;
}

export interface FileManageUpdateDto {
  /** 文件 ID */
  id: string;
  /** 文件备注 */
  desc: string;
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
  entityId: number;
  /** 字段名，如 title、desc、content */
  field: string;
  /** 语言代码 */
  lang: 'zh-CN' | 'en-US';
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
  lang: 'zh-CN' | 'en-US';
}

export interface ContentTranslationInfo {
  /** 实体名，如 news、product */
  entity: string;
  /** 实体记录 ID */
  entityId: number;
  /** 字段名，如 title、desc、content */
  field: string;
  /** 语言代码 */
  lang: 'zh-CN' | 'en-US';
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
  entityId?: number;
  /** 字段名，如 title、desc、content */
  field?: string;
  /** 语言代码 */
  lang?: 'zh-CN' | 'en-US';
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
  lang?: 'zh-CN' | 'en-US';
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
  /** 国际化Value */
  value: string;
  /** 语言 */
  lang: 'zh-CN' | 'en-US';
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
  /** 国际化Value */
  value: string;
  /** 语言 */
  lang: 'zh-CN' | 'en-US';
}

export interface SystemTranslationMultiCreateDto {
  list: SystemTranslationCreateDto[];
}

export interface SystemTranslationUpdateDto {
  /** 国际化Key */
  key?: string;
  /** 国际化描述 */
  desc?: string;
  /** 国际化Value */
  value?: string;
  /** 语言 */
  lang?: 'zh-CN' | 'en-US';
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
